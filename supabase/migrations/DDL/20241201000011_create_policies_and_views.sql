-- =====================================================
-- RLS POLICIES AND ANALYTICS VIEWS
-- Supabase Migration: 20241201000011_create_policies_and_views.sql
-- =====================================================

-- Habilitar RLS en tablas principales
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_attachments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- POLÍTICAS RLS PARA USERS
-- =====================================================

-- Users pueden ver su propio perfil
CREATE POLICY "users_can_view_own_profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users pueden actualizar su propio perfil
CREATE POLICY "users_can_update_own_profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Admins pueden ver todos los usuarios
CREATE POLICY "admins_can_view_all_users" ON users
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Admins pueden crear usuarios
CREATE POLICY "admins_can_create_users" ON users
    FOR INSERT WITH CHECK (
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- =====================================================
-- POLÍTICAS RLS PARA TASKS
-- =====================================================

-- Users pueden ver tareas asignadas a ellos
CREATE POLICY "users_can_view_assigned_tasks" ON tasks
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = id 
            AND ta.user_id = auth.uid() 
            AND ta.is_active = true
        )
        OR 
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
        OR created_by = auth.uid()
    );

-- Users pueden actualizar tareas asignadas o creadas por ellos
CREATE POLICY "users_can_update_own_tasks" ON tasks
    FOR UPDATE USING (
        created_by = auth.uid()
        OR
        EXISTS(
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = id 
            AND ta.user_id = auth.uid() 
            AND ta.is_active = true
        )
        OR 
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users pueden crear tareas
CREATE POLICY "authenticated_users_can_create_tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = created_by);

-- =====================================================
-- POLÍTICAS RLS PARA TASK_ASSIGNMENTS
-- =====================================================

-- Users pueden ver sus asignaciones
CREATE POLICY "users_can_view_own_assignments" ON task_assignments
    FOR SELECT USING (
        user_id = auth.uid()
        OR assigned_by = auth.uid()
        OR EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Solo admins o creadores de tarea pueden asignar
CREATE POLICY "authorized_users_can_create_assignments" ON task_assignments
    FOR INSERT WITH CHECK (
        assigned_by = auth.uid()
        AND (
            EXISTS(
                SELECT 1 FROM users 
                WHERE id = auth.uid() AND role = 'admin'
            )
            OR
            EXISTS(
                SELECT 1 FROM tasks 
                WHERE id = task_id AND created_by = auth.uid()
            )
        )
    );

-- =====================================================
-- POLÍTICAS RLS PARA NOTIFICATIONS
-- =====================================================

-- Users solo pueden ver sus propias notificaciones
CREATE POLICY "users_can_view_own_notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Users pueden actualizar estado de sus notificaciones (marcar como leída)
CREATE POLICY "users_can_update_own_notifications" ON notifications
    FOR UPDATE USING (user_id = auth.uid());

-- =====================================================
-- POLÍTICAS RLS PARA COMMENTS Y ATTACHMENTS
-- =====================================================

-- Users pueden ver comentarios de tareas asignadas
CREATE POLICY "users_can_view_task_comments" ON task_comments
    FOR SELECT USING (
        user_id = auth.uid()
        OR
        EXISTS(
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = task_comments.task_id 
            AND ta.user_id = auth.uid() 
            AND ta.is_active = true
        )
        OR 
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Users pueden crear comentarios en tareas asignadas
CREATE POLICY "users_can_create_task_comments" ON task_comments
    FOR INSERT WITH CHECK (
        user_id = auth.uid()
        AND
        EXISTS(
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = task_comments.task_id 
            AND ta.user_id = auth.uid() 
            AND ta.is_active = true
        )
    );

-- =====================================================
-- VISTAS DE ANALÍTICA
-- =====================================================

-- Vista: Estadísticas de usuario
CREATE OR REPLACE VIEW user_statistics AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.role,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'active' THEN 1 END) as active_tasks,
    COUNT(CASE WHEN t.status = 'active' AND t.due_date < CURRENT_TIMESTAMP THEN 1 END) as overdue_tasks,
    COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.cost ELSE 0 END), 0) as total_completed_value,
    COALESCE(AVG(CASE WHEN t.status = 'completed' THEN t.actual_hours END), 0) as avg_completion_hours,
    COUNT(ta.id) as total_assignments,
    u.created_at,
    u.last_login_at
FROM users u
LEFT JOIN task_assignments ta ON u.id = ta.user_id AND ta.is_active = true
LEFT JOIN tasks t ON ta.task_id = t.id
WHERE u.is_active = true
GROUP BY u.id, u.name, u.email, u.role, u.created_at, u.last_login_at;

-- Vista: Estadísticas de tareas por período
CREATE OR REPLACE VIEW task_statistics AS
SELECT 
    DATE_TRUNC('week', t.created_at) as week,
    COUNT(*) as tasks_created,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as tasks_completed,
    COUNT(CASE WHEN t.status = 'active' THEN 1 END) as tasks_active,
    COUNT(CASE WHEN t.status = 'active' AND t.due_date < CURRENT_TIMESTAMP THEN 1 END) as tasks_overdue,
    ROUND(AVG(t.cost), 2) as avg_cost,
    ROUND(SUM(t.cost), 2) as total_cost,
    ROUND(AVG(t.estimated_hours), 2) as avg_estimated_hours,
    ROUND(AVG(t.actual_hours), 2) as avg_actual_hours
FROM tasks t
WHERE t.created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', t.created_at)
ORDER BY week DESC;

-- Vista: Resumen de equipos
CREATE OR REPLACE VIEW team_summary AS
SELECT 
    tm.id,
    tm.name,
    tm.slug,
    COUNT(DISTINCT tms.user_id) as member_count,
    COUNT(DISTINCT t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'active' THEN 1 END) as active_tasks,
    COALESCE(SUM(t.cost), 0) as total_value,
    tm.created_at,
    tm.is_active
FROM teams tm
LEFT JOIN team_memberships tms ON tm.id = tms.team_id AND tms.is_active = true
LEFT JOIN tasks t ON tm.id = t.team_id
WHERE tm.is_active = true
GROUP BY tm.id, tm.name, tm.slug, tm.created_at, tm.is_active
ORDER BY tm.created_at DESC;

-- Vista: Dashboard de métricas principales
CREATE OR REPLACE VIEW dashboard_metrics AS
SELECT 
    'tasks' as metric_type,
    'total' as metric_name,
    COUNT(*)::TEXT as metric_value,
    'Total de tareas en el sistema' as description
FROM tasks
UNION ALL
SELECT 
    'tasks' as metric_type,
    'active' as metric_name,
    COUNT(*)::TEXT as metric_value,
    'Tareas activas' as description
FROM tasks WHERE status = 'active'
UNION ALL
SELECT 
    'tasks' as metric_type,
    'completed' as metric_name,
    COUNT(*)::TEXT as metric_value,
    'Tareas completadas' as description
FROM tasks WHERE status = 'completed'
UNION ALL
SELECT 
    'tasks' as metric_type,
    'overdue' as metric_name,
    COUNT(*)::TEXT as metric_value,
    'Tareas vencidas' as description
FROM tasks WHERE status = 'active' AND due_date < CURRENT_TIMESTAMP
UNION ALL
SELECT 
    'users' as metric_type,
    'total' as metric_name,
    COUNT(*)::TEXT as metric_value,
    'Total de usuarios activos' as description
FROM users WHERE is_active = true
UNION ALL
SELECT 
    'financial' as metric_type,
    'total_value' as metric_name,
    ROUND(COALESCE(SUM(cost), 0), 2)::TEXT as metric_value,
    'Valor total de todas las tareas' as description
FROM tasks
UNION ALL
SELECT 
    'financial' as metric_type,
    'completed_value' as metric_name,
    ROUND(COALESCE(SUM(cost), 0), 2)::TEXT as metric_value,
    'Valor de tareas completadas' as description
FROM tasks WHERE status = 'completed';

-- Comentarios en vistas
COMMENT ON VIEW user_statistics IS 'Estadísticas agregadas por usuario incluyendo tareas y rendimiento';
COMMENT ON VIEW task_statistics IS 'Estadísticas de tareas agrupadas por semana';
COMMENT ON VIEW team_summary IS 'Resumen de equipos con métricas básicas';
COMMENT ON VIEW dashboard_metrics IS 'Métricas principales para dashboard administrativo';