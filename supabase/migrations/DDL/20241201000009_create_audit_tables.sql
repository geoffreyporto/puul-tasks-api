-- =====================================================
-- AUDIT AND CONFIGURATION TABLES
-- Supabase Migration: 20241201000009_create_audit_tables.sql
-- =====================================================

-- Tabla: Logs de actividad
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Sesiones de usuario
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    
    session_token VARCHAR(255) UNIQUE NOT NULL,
    refresh_token VARCHAR(255) UNIQUE,
    
    ip_address INET,
    user_agent TEXT,
    device_info JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    revoked_at TIMESTAMP WITH TIME ZONE,
    revoked_by UUID
);

-- Tabla: Configuraciones del sistema
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(255) UNIQUE NOT NULL,
    value JSONB NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID
);

-- Tabla: Reportes generados
CREATE TABLE generated_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    
    parameters JSONB DEFAULT '{}',
    team_id UUID,
    
    data JSONB NOT NULL,
    file_url TEXT,
    
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    generated_by UUID,
    
    workflow_id VARCHAR(255),
    
    is_public BOOLEAN DEFAULT false,
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Tabla: Comentarios en tareas
CREATE TABLE task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    user_id UUID NOT NULL,
    
    content TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    
    parent_comment_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT task_comments_content_length CHECK (LENGTH(content) >= 1 AND LENGTH(content) <= 5000)
);

-- Tabla: Archivos adjuntos
CREATE TABLE task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL,
    uploaded_by UUID NOT NULL,
    
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    mime_type VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT task_attachments_file_size_limit CHECK (file_size <= 50 * 1024 * 1024)
);

-- Foreign Keys
ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_logs_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_revoked_by 
    FOREIGN KEY (revoked_by) REFERENCES users(id);

ALTER TABLE system_settings ADD CONSTRAINT fk_system_settings_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(id);

ALTER TABLE generated_reports ADD CONSTRAINT fk_generated_reports_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id);
ALTER TABLE generated_reports ADD CONSTRAINT fk_generated_reports_generated_by 
    FOREIGN KEY (generated_by) REFERENCES users(id);

ALTER TABLE task_comments ADD CONSTRAINT fk_task_comments_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE task_comments ADD CONSTRAINT fk_task_comments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE task_comments ADD CONSTRAINT fk_task_comments_parent_comment_id 
    FOREIGN KEY (parent_comment_id) REFERENCES task_comments(id);

ALTER TABLE task_attachments ADD CONSTRAINT fk_task_attachments_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE task_attachments ADD CONSTRAINT fk_task_attachments_uploaded_by 
    FOREIGN KEY (uploaded_by) REFERENCES users(id);

-- Índices
CREATE INDEX idx_activity_logs_user_id_time ON activity_logs(user_id, occurred_at DESC);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_activity_logs_time ON activity_logs(occurred_at DESC);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active) WHERE is_active = true;
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX idx_system_settings_key ON system_settings(key);
CREATE INDEX idx_system_settings_public ON system_settings(is_public) WHERE is_public = true;

CREATE INDEX idx_task_comments_task_id ON task_comments(task_id, created_at DESC);
CREATE INDEX idx_task_comments_user_id ON task_comments(user_id);

CREATE INDEX idx_task_attachments_task_id ON task_attachments(task_id);
CREATE INDEX idx_task_attachments_uploaded_by ON task_attachments(uploaded_by);

-- Triggers
CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE activity_logs IS 'Log de todas las actividades del sistema para auditoría';
COMMENT ON TABLE user_sessions IS 'Sesiones activas de usuarios para manejo de JWT';
COMMENT ON TABLE system_settings IS 'Configuraciones globales del sistema';
COMMENT ON TABLE generated_reports IS 'Reportes generados por el sistema';
COMMENT ON TABLE task_comments IS 'Comentarios en tareas';
COMMENT ON TABLE task_attachments IS 'Archivos adjuntos a tareas';