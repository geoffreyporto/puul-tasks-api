-- =====================================================
-- TEAM MEMBERSHIPS TABLE
-- Supabase Migration: 20241201000004_create_team_memberships_table.sql
-- =====================================================

-- Tabla: Membresías de equipo
CREATE TABLE team_memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    team_id UUID NOT NULL,
    role user_role DEFAULT 'member',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    
    UNIQUE(user_id, team_id)
);

-- Foreign Keys para team_memberships
ALTER TABLE team_memberships ADD CONSTRAINT fk_team_memberships_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE team_memberships ADD CONSTRAINT fk_team_memberships_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- Índices para team_memberships
CREATE INDEX idx_team_memberships_user_id ON team_memberships(user_id);
CREATE INDEX idx_team_memberships_team_id ON team_memberships(team_id);
CREATE INDEX idx_team_memberships_active ON team_memberships(is_active) WHERE is_active = true;
CREATE INDEX idx_team_memberships_user_team ON team_memberships(user_id, team_id);

-- Comentarios
COMMENT ON TABLE team_memberships IS 'Relación many-to-many entre usuarios y equipos';
COMMENT ON COLUMN team_memberships.role IS 'Rol del usuario dentro del equipo específico';
COMMENT ON COLUMN team_memberships.joined_at IS 'Fecha cuando el usuario se unió al equipo';
COMMENT ON COLUMN team_memberships.is_active IS 'Indica si la membresía está activa';