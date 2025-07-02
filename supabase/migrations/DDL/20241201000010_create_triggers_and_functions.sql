-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- Supabase Migration: 20241201000010_create_triggers_and_functions.sql
-- =====================================================

-- Función para logging automático de cambios en tareas
CREATE OR REPLACE FUNCTION log_task_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        INSERT INTO activity_logs (
            user_id, action, resource_type, resource_id, 
            old_values, new_values, occurred_at
        ) VALUES (
            NEW.updated_by, 'UPDATE', 'TASK', NEW.id,
            to_jsonb(OLD), to_jsonb(NEW), CURRENT_TIMESTAMP
        );
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (
            user_id, action, resource_type, resource_id, 
            new_values, occurred_at
        ) VALUES (
            NEW.created_by, 'CREATE', 'TASK', NEW.id,
            to_jsonb(NEW), CURRENT_TIMESTAMP
        );
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger para logging de cambios en tareas
CREATE TRIGGER log_task_changes_trigger
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION log_task_changes();

-- Función para logging de asignaciones de tareas
CREATE OR REPLACE FUNCTION log_task_assignment_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO activity_logs (
            user_id, action, resource_type, resource_id, 
            new_values, occurred_at
        ) VALUES (
            NEW.assigned_by, 'ASSIGN_TASK', 'TASK_ASSIGNMENT', NEW.id,
            jsonb_build_object(
                'task_id', NEW.task_id,
                'user_id', NEW.user_id,
                'assigned_by', NEW.assigned_by,
                'is_primary', NEW.is_primary
            ), CURRENT_TIMESTAMP
        );
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' AND OLD.is_active = true AND NEW.is_active = false THEN
        INSERT INTO activity_logs (
            user_id, action, resource_type, resource_id, 
            old_values, new_values, occurred_at
        ) VALUES (
            NEW.assigned_by, 'UNASSIGN_TASK', 'TASK_ASSIGNMENT', NEW.id,
            to_jsonb(OLD), to_jsonb(NEW), CURRENT_TIMESTAMP
        );
        RETURN NEW;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para logging de asignaciones
CREATE TRIGGER log_task_assignment_changes_trigger
    AFTER INSERT OR UPDATE ON task_assignments
    FOR EACH ROW EXECUTE FUNCTION log_task_assignment_changes();

-- Función para actualizar last_activity_at en sesiones
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_activity_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Función para validar que solo una asignación sea primaria por tarea
CREATE OR REPLACE FUNCTION validate_primary_assignment()
RETURNS TRIGGER AS $$
BEGIN
    -- Si se está marcando como primaria
    IF NEW.is_primary = true AND NEW.is_active = true THEN
        -- Desmarcar otras asignaciones primarias de la misma tarea
        UPDATE task_assignments 
        SET is_primary = false 
        WHERE task_id = NEW.task_id 
        AND id != NEW.id 
        AND is_primary = true 
        AND is_active = true;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para validar asignación primaria
CREATE TRIGGER validate_primary_assignment_trigger
    BEFORE INSERT OR UPDATE ON task_assignments
    FOR EACH ROW EXECUTE FUNCTION validate_primary_assignment();

-- Función para auto-completar tareas cuando todas las asignaciones están completas
CREATE OR REPLACE FUNCTION check_task_completion()
RETURNS TRIGGER AS $$
DECLARE
    total_assignments INTEGER;
    completed_assignments INTEGER;
    task_record RECORD;
BEGIN
    -- Obtener conteos de asignaciones
    SELECT COUNT(*) INTO total_assignments
    FROM task_assignments 
    WHERE task_id = COALESCE(NEW.task_id, OLD.task_id) 
    AND is_active = true;
    
    SELECT COUNT(*) INTO completed_assignments
    FROM task_assignments 
    WHERE task_id = COALESCE(NEW.task_id, OLD.task_id) 
    AND is_active = true 
    AND completed_at IS NOT NULL;
    
    -- Si todas las asignaciones están completas, completar la tarea
    IF total_assignments > 0 AND total_assignments = completed_assignments THEN
        SELECT * INTO task_record FROM tasks WHERE id = COALESCE(NEW.task_id, OLD.task_id);
        
        IF task_record.status != 'completed' THEN
            UPDATE tasks 
            SET 
                status = 'completed',
                completed_at = CURRENT_TIMESTAMP,
                completion_percentage = 100,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = COALESCE(NEW.task_id, OLD.task_id);
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger para auto-completar tareas
CREATE TRIGGER check_task_completion_trigger
    AFTER UPDATE ON task_assignments
    FOR EACH ROW 
    WHEN (OLD.completed_at IS NULL AND NEW.completed_at IS NOT NULL)
    EXECUTE FUNCTION check_task_completion();

-- Función para calcular estadísticas de usuario en tiempo real
CREATE OR REPLACE FUNCTION calculate_user_stats(user_uuid UUID)
RETURNS TABLE(
    completed_tasks INTEGER,
    active_tasks INTEGER,
    overdue_tasks INTEGER,
    total_completed_value DECIMAL,
    avg_completion_hours DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END)::INTEGER as completed_tasks,
        COUNT(CASE WHEN t.status = 'active' THEN 1 END)::INTEGER as active_tasks,
        COUNT(CASE WHEN t.status = 'active' AND t.due_date < CURRENT_TIMESTAMP THEN 1 END)::INTEGER as overdue_tasks,
        COALESCE(SUM(CASE WHEN t.status = 'completed' THEN t.cost ELSE 0 END), 0) as total_completed_value,
        COALESCE(AVG(CASE WHEN t.status = 'completed' THEN t.actual_hours END), 0) as avg_completion_hours
    FROM task_assignments ta
    JOIN tasks t ON ta.task_id = t.id
    WHERE ta.user_id = user_uuid 
    AND ta.is_active = true;
END;
$$ language 'plpgsql';

-- Comentarios
COMMENT ON FUNCTION log_task_changes() IS 'Registra automáticamente cambios en tareas para auditoría';
COMMENT ON FUNCTION log_task_assignment_changes() IS 'Registra cambios en asignaciones de tareas';
COMMENT ON FUNCTION validate_primary_assignment() IS 'Valida que solo haya una asignación primaria por tarea';
COMMENT ON FUNCTION check_task_completion() IS 'Auto-completa tareas cuando todas sus asignaciones están completas';
COMMENT ON FUNCTION calculate_user_stats(UUID) IS 'Calcula estadísticas de usuario en tiempo real';