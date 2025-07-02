-- =====================================================
-- TASK ASSIGNMENTS TABLE
-- Supabase Migration: 20241201000007_create_task_assignments_table.sql
-- =====================================================

-- Tabla: Asignaciones de tareas
CREATE TABLE task_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    hours_allocated DECIMAL(6,2) CHECK (hours_allocated > 0),
    notes TEXT,
    
    accepted_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(task_id, user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Foreign Keys para task_assignments
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_assigned_by 
    FOREIGN KEY (assigned_by) REFERENCES users(id);

-- Índices para task_assignments
CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user_id ON task_assignments(user_id);
CREATE INDEX idx_task_assignments_active ON task_assignments(is_active) WHERE is_active = true;
CREATE INDEX idx_task_assignments_primary ON task_assignments(is_primary) WHERE is_primary = true;
CREATE INDEX idx_task_assignments_task_user ON task_assignments(task_id, user_id);

-- Función para actualizar contador de asignados
CREATE OR REPLACE FUNCTION update_task_assignee_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE tasks 
    SET assignee_count = (
        SELECT COUNT(*) 
        FROM task_assignments 
        WHERE task_id = COALESCE(NEW.task_id, OLD.task_id) 
        AND is_active = true
    )
    WHERE id = COALESCE(NEW.task_id, OLD.task_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Trigger para actualizar contador de asignados
CREATE TRIGGER update_task_assignee_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON task_assignments
    FOR EACH ROW EXECUTE FUNCTION update_task_assignee_count();

-- Comentarios
COMMENT ON TABLE task_assignments IS 'Asignaciones de usuarios a tareas (relación many-to-many)';
COMMENT ON COLUMN task_assignments.is_primary IS 'Indica si este usuario es el responsable principal';
COMMENT ON COLUMN task_assignments.hours_allocated IS 'Horas asignadas específicamente a este usuario';
COMMENT ON COLUMN task_assignments.notes IS 'Notas específicas para esta asignación';
COMMENT ON COLUMN task_assignments.accepted_at IS 'Fecha cuando el usuario aceptó la asignación';
COMMENT ON COLUMN task_assignments.is_active IS 'Indica si la asignación está activa';