-- =====================================================
-- TASKS TABLE
-- Supabase Migration: 20241201000006_create_tasks_table.sql
-- =====================================================

-- Tabla: Tareas (principal)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    
    -- Campos de negocio requeridos
    estimated_hours DECIMAL(6,2) NOT NULL CHECK (estimated_hours > 0),
    actual_hours DECIMAL(6,2) DEFAULT 0 CHECK (actual_hours >= 0),
    cost DECIMAL(12,2) NOT NULL CHECK (cost >= 0),
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    
    -- Estados y prioridad
    status task_status DEFAULT 'active',
    priority task_priority DEFAULT 'medium',
    
    -- Relaciones
    category_id UUID,
    team_id UUID,
    parent_task_id UUID,
    
    -- Fechas de control
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_by UUID,
    
    -- Campos calculados
    assignee_count INTEGER DEFAULT 0,
    completion_percentage DECIMAL(5,2) DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Constraints de negocio
    CONSTRAINT tasks_title_length CHECK (LENGTH(title) >= 3 AND LENGTH(title) <= 500),
    CONSTRAINT tasks_due_date_future CHECK (due_date > created_at),
    CONSTRAINT tasks_completion_logic CHECK (
        (status = 'completed' AND completed_at IS NOT NULL) OR 
        (status != 'completed' AND completed_at IS NULL)
    )
);

-- Foreign Keys para tasks
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_category_id 
    FOREIGN KEY (category_id) REFERENCES task_categories(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_parent_task_id 
    FOREIGN KEY (parent_task_id) REFERENCES tasks(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE tasks ADD CONSTRAINT fk_tasks_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Índices para performance en tasks
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_team_id ON tasks(team_id);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status_due_date ON tasks(status, due_date);
CREATE INDEX idx_tasks_team_status ON tasks(team_id, status);
CREATE INDEX idx_tasks_title ON tasks USING gin(to_tsvector('spanish', title));

-- Trigger para updated_at en tasks
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE tasks IS 'Tabla principal de tareas del sistema';
COMMENT ON COLUMN tasks.estimated_hours IS 'Horas estimadas para completar la tarea';
COMMENT ON COLUMN tasks.actual_hours IS 'Horas reales invertidas en la tarea';
COMMENT ON COLUMN tasks.cost IS 'Costo monetario asociado a la tarea';
COMMENT ON COLUMN tasks.due_date IS 'Fecha y hora de vencimiento de la tarea';
COMMENT ON COLUMN tasks.parent_task_id IS 'ID de tarea padre para crear subtareas';
COMMENT ON COLUMN tasks.assignee_count IS 'Contador automático de usuarios asignados';
COMMENT ON COLUMN tasks.completion_percentage IS 'Porcentaje de completitud (0-100)';