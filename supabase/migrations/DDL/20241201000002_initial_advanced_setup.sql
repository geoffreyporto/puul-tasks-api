-- =====================================================
-- CONFIGURACIÓN ESPECÍFICA PARA SUPABASE
-- Configuraciones avanzadas, RLS, Storage y Real-time
-- =====================================================

-- =====================================================
-- 1. CONFIGURACIÓN DE AUTENTICACIÓN
-- =====================================================

-- Configurar proveedores de autenticación en Supabase Dashboard
-- Esta configuración se hace via UI, pero documentamos aquí:
/*
Auth Providers a habilitar:
- Email/Password: ✅ Habilitado
- Google OAuth: ✅ Recomendado
- GitHub OAuth: ✅ Para desarrolladores
- Magic Links: ✅ Para UX mejorada

Settings de Email:
- Confirm email: true
- Email change confirmation: true
- Email templates: Personalizar con branding de Puul

Security Settings:
- JWT expiry: 3600 (1 hora)
- Refresh token rotation: true
- Password requirements: Mínimo 8 caracteres, mayúsculas, números
*/

-- =====================================================
-- 2. POLÍTICAS RLS AVANZADAS
-- =====================================================

-- Política: Los usuarios pueden crear otros usuarios (solo admins)
CREATE POLICY "Admins can create users" ON users
    FOR INSERT WITH CHECK (
        EXISTS(
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
    );

-- Política: Los usuarios pueden actualizar otros usuarios (solo admins o el mismo usuario)
CREATE POLICY "Users can update profiles" ON users
    FOR UPDATE USING (
        auth.uid() = id  -- El mismo usuario
        OR EXISTS(
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
    );

-- Política: Solo admins pueden eliminar usuarios
CREATE POLICY "Admins can delete users" ON users
    FOR DELETE USING (
        EXISTS(
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
    );

-- Política: Los usuarios pueden crear tareas
CREATE POLICY "Users can create tasks" ON tasks
    FOR INSERT WITH CHECK (
        auth.uid() = created_by
        AND EXISTS(
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() AND u.is_active = true
        )
    );

-- Política: Los usuarios pueden actualizar tareas asignadas o creadas por ellos
CREATE POLICY "Users can update assigned tasks" ON tasks
    FOR UPDATE USING (
        auth.uid() = created_by  -- Creador de la tarea
        OR EXISTS(
            SELECT 1 FROM task_assignments ta
            WHERE ta.task_id = id 
            AND ta.user_id = auth.uid() 
            AND ta.is_active = true
        )
        OR EXISTS(  -- O admin
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
    );

-- Política: Solo admins o creadores pueden eliminar tareas
CREATE POLICY "Authorized users can delete tasks" ON tasks
    FOR DELETE USING (
        auth.uid() = created_by
        OR EXISTS(
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
    );

-- Política: Los usuarios pueden ver asignaciones donde participan
CREATE POLICY "Users can view their assignments" ON task_assignments
    FOR SELECT USING (
        auth.uid() = user_id  -- Asignado
        OR auth.uid() = assigned_by  -- Quien asignó
        OR EXISTS(  -- O admin
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
        OR EXISTS(  -- O creador de la tarea
            SELECT 1 FROM tasks t
            WHERE t.id = task_id AND t.created_by = auth.uid()
        )
    );

-- Política: Usuarios autorizados pueden crear asignaciones
CREATE POLICY "Authorized users can create assignments" ON task_assignments
    FOR INSERT WITH CHECK (
        auth.uid() = assigned_by
        AND (
            EXISTS(  -- Admin
                SELECT 1 FROM users admin_user
                WHERE admin_user.id = auth.uid() 
                AND admin_user.role = 'admin'
                AND admin_user.is_active = true
            )
            OR EXISTS(  -- Creador de la tarea
                SELECT 1 FROM tasks t
                WHERE t.id = task_id AND t.created_by = auth.uid()
            )
            OR EXISTS(  -- Miembro del mismo equipo
                SELECT 1 FROM tasks t
                JOIN team_memberships tm1 ON t.team_id = tm1.team_id
                JOIN team_memberships tm2 ON tm1.team_id = tm2.team_id
                WHERE t.id = task_id 
                AND tm1.user_id = auth.uid() 
                AND tm2.user_id = user_id
                AND tm1.is_active = true 
                AND tm2.is_active = true
            )
        )
    );

-- Política: Los usuarios pueden ver sus propias notificaciones
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

-- Política: Solo el sistema puede crear notificaciones (via service role)
CREATE POLICY "System can create notifications" ON notifications
    FOR INSERT WITH CHECK (
        -- Esta política se aplica solo cuando se usa service role key
        auth.role() = 'service_role'
    );

-- Política: Los usuarios pueden marcar sus notificaciones como leídas
CREATE POLICY "Users can update own notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden ver logs relacionados con sus acciones
CREATE POLICY "Users can view related activity logs" ON activity_logs
    FOR SELECT USING (
        auth.uid() = user_id  -- Sus propias acciones
        OR EXISTS(  -- O admin
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid() 
            AND admin_user.role = 'admin'
            AND admin_user.is_active = true
        )
        OR (  -- O logs de recursos que puede ver
            resource_type = 'TASK' 
            AND EXISTS(
                SELECT 1 FROM tasks t
                JOIN task_assignments ta ON t.id = ta.task_id
                WHERE t.id = resource_id::uuid 
                AND ta.user_id = auth.uid() 
                AND ta.is_active = true
            )
        )
    );

-- =====================================================
-- 3. CONFIGURACIÓN DE STORAGE
-- =====================================================

-- Crear bucket para archivos adjuntos de tareas
INSERT INTO storage.buckets (id, name, public) 
VALUES ('task-attachments', 'task-attachments', false);

-- Política de storage: Los usuarios pueden subir archivos a sus tareas
CREATE POLICY "Users can upload to assigned tasks" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'task-attachments'
        AND auth.uid()::text = (storage.foldername(name))[1]  -- Primera carpeta debe ser user_id
        AND EXISTS(
            SELECT 1 FROM task_assignments ta
            JOIN tasks t ON ta.task_id = t.id
            WHERE ta.user_id = auth.uid() 
            AND t.id = ((storage.foldername(name))[2])::uuid  -- Segunda carpeta es task_id
            AND ta.is_active = true
        )
    );

-- Política de storage: Los usuarios pueden ver archivos de sus tareas
CREATE POLICY "Users can view task attachments" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'task-attachments'
        AND (
            auth.uid()::text = (storage.foldername(name))[1]  -- Sus propios archivos
            OR EXISTS(  -- O archivos de tareas asignadas
                SELECT 1 FROM task_assignments ta
                WHERE ta.user_id = auth.uid() 
                AND ta.task_id = ((storage.foldername(name))[2])::uuid
                AND ta.is_active = true
            )
            OR EXISTS(  -- O admin
                SELECT 1 FROM users u
                WHERE u.id = auth.uid() 
                AND u.role = 'admin'
                AND u.is_active = true
            )
        )
    );

-- Política de storage: Los usuarios pueden eliminar sus propios archivos
CREATE POLICY "Users can delete own attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'task-attachments'
        AND (
            auth.uid()::text = (storage.foldername(name))[1]  -- Sus propios archivos
            OR EXISTS(  -- O admin
                SELECT 1 FROM users u
                WHERE u.id = auth.uid() 
                AND u.role = 'admin'
                AND u.is_active = true
            )
        )
    );

-- =====================================================
-- 4. CONFIGURACIÓN DE REAL-TIME
-- =====================================================

-- Habilitar real-time para tablas específicas
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE task_assignments;
ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;

-- Configurar filtros de real-time para optimizar performance
-- Estas configuraciones se hacen en el cliente, pero documentamos aquí:
/*
// En el cliente JavaScript/TypeScript:

// Escuchar notificaciones del usuario actual
const notificationsChannel = supabase
  .channel('user_notifications')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'notifications',
    filter: `user_id=eq.${userId}`
  }, (payload) => {
    // Manejar nueva notificación
  })
  .subscribe();

// Escuchar cambios en tareas asignadas
const tasksChannel = supabase
  .channel('user_tasks')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'tasks',
    filter: `id=in.(${userTaskIds.join(',')})`
  }, (payload) => {
    // Manejar cambios en tareas
  })
  .subscribe();

// Escuchar nuevos comentarios en tareas del usuario
const commentsChannel = supabase
  .channel('task_comments')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'task_comments',
    filter: `task_id=in.(${userTaskIds.join(',')})`
  }, (payload) => {
    // Manejar nuevo comentario
  })
  .subscribe();
*/

-- =====================================================
-- 5. FUNCIONES DE SEGURIDAD PERSONALIZADAS
-- =====================================================

-- Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'admin'
        AND is_active = true
    );
$$;

-- Función para verificar si el usuario puede acceder a una tarea
CREATE OR REPLACE FUNCTION auth.can_access_task(task_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(
        SELECT 1 FROM tasks t
        LEFT JOIN task_assignments ta ON t.id = ta.task_id AND ta.is_active = true
        WHERE t.id = task_uuid
        AND (
            t.created_by = auth.uid()  -- Creador
            OR ta.user_id = auth.uid()  -- Asignado
            OR auth.is_admin()  -- Admin
        )
    );
$$;

-- Función para verificar membresía de equipo
CREATE OR REPLACE FUNCTION auth.is_team_member(team_uuid uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS(
        SELECT 1 FROM team_memberships tm
        WHERE tm.team_id = team_uuid 
        AND tm.user_id = auth.uid()
        AND tm.is_active = true
    );
$$;

-- =====================================================
-- 6. TRIGGERS ESPECÍFICOS PARA SUPABASE
-- =====================================================

-- Trigger para sincronizar usuarios con auth.users
CREATE OR REPLACE FUNCTION sync_user_with_auth()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Solo ejecutar si el usuario fue creado via Supabase Auth
    IF NEW.id IN (SELECT id FROM auth.users) THEN
        -- Actualizar metadatos en auth.users si es necesario
        UPDATE auth.users 
        SET 
            raw_user_meta_data = raw_user_meta_data || jsonb_build_object(
                'name', NEW.name,
                'role', NEW.role::text,
                'timezone', NEW.timezone
            )
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER sync_user_with_auth_trigger
    AFTER INSERT OR UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION sync_user_with_auth();

-- Trigger para limpiar datos relacionados cuando se elimina un usuario
CREATE OR REPLACE FUNCTION cleanup_user_data()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Marcar como inactivo en lugar de eliminar
    UPDATE users SET is_active = false WHERE id = OLD.id;
    
    -- Desactivar asignaciones
    UPDATE task_assignments SET is_active = false WHERE user_id = OLD.id;
    
    -- Revocar sesiones activas
    UPDATE user_sessions SET is_active = false, revoked_at = CURRENT_TIMESTAMP 
    WHERE user_id = OLD.id AND is_active = true;
    
    RETURN OLD;
END;
$$;

-- =====================================================
-- 7. VISTAS PARA OPTIMIZACIÓN
-- =====================================================

-- Vista optimizada para el dashboard principal
CREATE OR REPLACE VIEW dashboard_overview AS
SELECT 
    'tasks' as metric_type,
    'total' as metric_name,
    COUNT(*)::text as value,
    'count' as unit
FROM tasks
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'tasks' as metric_type,
    'completed' as metric_name,
    COUNT(*)::text as value,
    'count' as unit
FROM tasks
WHERE status = 'completed' AND completed_at >= CURRENT_DATE - INTERVAL '30 days'

UNION ALL

SELECT 
    'tasks' as metric_type,
    'overdue' as metric_name,
    COUNT(*)::text as value,
    'count' as unit
FROM tasks
WHERE status = 'active' AND due_date < CURRENT_TIMESTAMP

UNION ALL

SELECT 
    'users' as metric_type,
    'active' as metric_name,
    COUNT(*)::text as value,
    'count' as unit
FROM users
WHERE is_active = true AND last_login_at >= CURRENT_DATE - INTERVAL '7 days'

UNION ALL

SELECT 
    'revenue' as metric_type,
    'completed' as metric_name,
    COALESCE(SUM(cost), 0)::text as value,
    'currency' as unit
FROM tasks
WHERE status = 'completed' AND completed_at >= CURRENT_DATE - INTERVAL '30 days';

-- Vista para notificaciones no leídas por usuario
CREATE OR REPLACE VIEW user_unread_notifications AS
SELECT 
    user_id,
    COUNT(*) as unread_count,
    COUNT(CASE WHEN type IN ('DUE_TODAY', 'OVERDUE', 'ESCALATION') THEN 1 END) as urgent_count,
    MAX(created_at) as latest_notification
FROM notifications
WHERE read_at IS NULL
GROUP BY user_id;

-- =====================================================
-- 8. CONFIGURACIONES DE PERFORMANCE
-- =====================================================

-- Configurar connection pooling (se hace en Supabase Dashboard)
/*
Database Settings en Supabase:
- Max connections: 100 (para plan Pro)
- Connection pooling: PgBouncer habilitado
- Pool mode: Transaction
- Pool size: 15
*/

-- Índices parciales para performance
CREATE INDEX CONCURRENTLY idx_tasks_active_due_date 
ON tasks(due_date) 
WHERE status = 'active';

CREATE INDEX CONCURRENTLY idx_notifications_unread 
ON notifications(user_id, created_at DESC) 
WHERE read_at IS NULL;

CREATE INDEX CONCURRENTLY idx_task_assignments_active_user 
ON task_assignments(user_id, task_id) 
WHERE is_active = true;

CREATE INDEX CONCURRENTLY idx_users_active_login 
ON users(last_login_at DESC) 
WHERE is_active = true;

-- Índice para búsqueda de texto completo en tareas
CREATE INDEX CONCURRENTLY idx_tasks_search 
ON tasks USING gin(to_tsvector('spanish', title || ' ' || COALESCE(description, '')));

-- =====================================================
-- 9. CONFIGURACIÓN DE WEBHOOKS
-- =====================================================

-- Función para webhook de nuevas tareas
CREATE OR REPLACE FUNCTION notify_new_task()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Enviar webhook a sistema externo (ejemplo)
    PERFORM net.http_post(
        url := 'https://api.puul.com/webhooks/new-task',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.webhook_token', true) || '"}'::jsonb,
        body := jsonb_build_object(
            'event', 'task.created',
            'task_id', NEW.id,
            'title', NEW.title,
            'created_by', NEW.created_by,
            'team_id', NEW.team_id,
            'due_date', NEW.due_date,
            'cost', NEW.cost
        )
    );
    
    RETURN NEW;
END;
$$;

-- Trigger para webhook (deshabilitado por defecto)
-- CREATE TRIGGER notify_new_task_trigger
--     AFTER INSERT ON tasks
--     FOR EACH ROW EXECUTE FUNCTION notify_new_task();

-- =====================================================
-- 10. CONFIGURACIÓN DE BACKUP Y RECOVERY
-- =====================================================

-- Configurar point-in-time recovery (PITR)
-- Esto se configura en Supabase Dashboard:
/*
Database > Settings > Backups:
- Enable PITR: ✅
- Retention period: 30 days (mínimo recomendado)
- Automated backups: Daily at 2 AM UTC
- Backup retention: 90 days
*/

-- Script para verificar integridad de datos
CREATE OR REPLACE FUNCTION check_data_integrity()
RETURNS TABLE(table_name text, issue_type text, count bigint)
LANGUAGE sql
AS $$
    -- Tareas sin creador válido
    SELECT 'tasks'::text, 'orphaned_tasks'::text, COUNT(*)
    FROM tasks t
    LEFT JOIN users u ON t.created_by = u.id
    WHERE u.id IS NULL
    
    UNION ALL
    
    -- Asignaciones a usuarios inexistentes
    SELECT 'task_assignments'::text, 'invalid_user_assignments'::text, COUNT(*)
    FROM task_assignments ta
    LEFT JOIN users u ON ta.user_id = u.id
    WHERE u.id IS NULL
    
    UNION ALL
    
    -- Asignaciones a tareas inexistentes
    SELECT 'task_assignments'::text, 'invalid_task_assignments'::text, COUNT(*)
    FROM task_assignments ta
    LEFT JOIN tasks t ON ta.task_id = t.id
    WHERE t.id IS NULL
    
    UNION ALL
    
    -- Contadores desincronizados
    SELECT 'tasks'::text, 'wrong_assignee_count'::text, COUNT(*)
    FROM tasks t
    WHERE t.assignee_count != (
        SELECT COUNT(*) 
        FROM task_assignments ta 
        WHERE ta.task_id = t.id AND ta.is_active = true
    );
$$;

-- =====================================================
-- VERIFICACIONES FINALES
-- =====================================================

-- Verificar que RLS está habilitado en todas las tablas críticas
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'tasks', 'task_assignments', 'notifications', 'activity_logs')
ORDER BY tablename;

-- Verificar que existen políticas para todas las operaciones críticas
SELECT schemaname, tablename, policyname, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, cmd;

-- Verificar configuración de storage
SELECT id, name, public, created_at 
FROM storage.buckets 
ORDER BY created_at;

SELECT 'Configuración de Supabase completada exitosamente' as status;