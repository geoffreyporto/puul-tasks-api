-- =====================================================
-- TASK CATEGORIES TABLE
-- Supabase Migration: 20241201000005_create_task_categories_table.sql
-- =====================================================

-- Tabla: Categorías de tareas
CREATE TABLE task_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    team_id UUID,
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    CONSTRAINT task_categories_color_format CHECK (color ~* '^#[0-9A-Fa-f]{6}$')
);

-- Foreign Keys para task_categories
ALTER TABLE task_categories ADD CONSTRAINT fk_task_categories_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id);
ALTER TABLE task_categories ADD CONSTRAINT fk_task_categories_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);

-- Índices para task_categories
CREATE INDEX idx_task_categories_team_id ON task_categories(team_id);
CREATE INDEX idx_task_categories_active ON task_categories(is_active) WHERE is_active = true;
CREATE INDEX idx_task_categories_name ON task_categories(name);

-- Trigger para updated_at en task_categories
CREATE TRIGGER update_task_categories_updated_at 
    BEFORE UPDATE ON task_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE task_categories IS 'Categorías para clasificar tareas';
COMMENT ON COLUMN task_categories.color IS 'Color en formato hexadecimal para la UI';
COMMENT ON COLUMN task_categories.team_id IS 'Equipo al que pertenece la categoría (NULL = global)';
COMMENT ON COLUMN task_categories.is_active IS 'Indica si la categoría está disponible para uso';