-- =====================================================
-- TEAMS TABLE
-- Supabase Migration: 20241201000003_create_teams_table.sql
-- =====================================================

-- Tabla: Equipos/Departamentos
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    slug VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    
    CONSTRAINT teams_slug_format CHECK (slug ~* '^[a-z0-9-]+$')
);

-- Foreign Keys para teams
ALTER TABLE teams ADD CONSTRAINT fk_teams_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);

-- Índices para teams
CREATE INDEX idx_teams_slug ON teams(slug);
CREATE INDEX idx_teams_active ON teams(is_active) WHERE is_active = true;
CREATE INDEX idx_teams_created_by ON teams(created_by);

-- Trigger para updated_at en teams
CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE teams IS 'Equipos o departamentos dentro de la organización';
COMMENT ON COLUMN teams.slug IS 'Identificador único amigable para URLs';
COMMENT ON COLUMN teams.settings IS 'Configuraciones específicas del equipo en formato JSON';
COMMENT ON COLUMN teams.is_active IS 'Indica si el equipo está activo';