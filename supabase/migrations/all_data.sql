-- =====================================================
-- SCRIPT DE MIGRACIÓN PARA SUPABASE
-- Puul Tasks API - PostgreSQL 15.8
-- Ejecutar en orden: V001 -> V002 -> ... -> V007
-- =====================================================

-- =====================================================
-- V001: EXTENSIONES Y CONFIGURACIÓN INICIAL
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Configurar timezone por defecto
SET timezone = 'UTC';

-- =====================================================
-- V002: ENUMERACIONES (ENUMS)
-- =====================================================

-- Roles de usuario
CREATE TYPE user_role AS ENUM ('member', 'admin');

-- Estados de tarea
CREATE TYPE task_status AS ENUM ('active', 'completed', 'cancelled', 'on_hold');

-- Prioridades de tarea
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Tipos de notificación
CREATE TYPE notification_type AS ENUM (
    'REMINDER_3_DAYS', 
    'REMINDER_1_DAY', 
    'DUE_TODAY', 
    'OVERDUE', 
    'ESCALATION',
    'TASK_ASSIGNED',
    'TASK_COMPLETED',
    'TASK_UPDATED'
);

-- Estados de notificación
CREATE TYPE notification_status AS ENUM ('pending', 'sent', 'delivered', 'failed', 'cancelled');

-- Canales de notificación
CREATE TYPE notification_channel AS ENUM ('email', 'sms', 'in_app', 'slack', 'teams');

-- =====================================================
-- V003: TABLAS PRINCIPALES
-- =====================================================

-- Tabla: Usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'member',
    password_hash VARCHAR(255),
    avatar_url TEXT,
    phone VARCHAR(20),
    timezone VARCHAR(50) DEFAULT 'UTC',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadatos
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    updated_by UUID,
    
    -- Constraints
    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_length CHECK (LENGTH(name) >= 2 AND LENGTH(name) <= 255)
);

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

-- =====================================================
-- V004: TABLAS DE NOTIFICACIONES Y WORKFLOWS
-- =====================================================

-- Tabla: Notificaciones
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    status notification_status DEFAULT 'pending',
    
    task_id UUID,
    related_user_id UUID,
    
    scheduled_for TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    
    workflow_id VARCHAR(255),
    workflow_run_id VARCHAR(255),
    
    read_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT notifications_schedule_check CHECK (scheduled_for >= created_at)
);

-- Tabla: Templates de notificación
CREATE TABLE notification_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) UNIQUE NOT NULL,
    type notification_type NOT NULL,
    channel notification_channel NOT NULL,
    
    subject_template TEXT NOT NULL,
    body_template TEXT NOT NULL,
    variables JSONB DEFAULT '[]',
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID
);

-- =====================================================
-- V005: TABLAS DE AUDITORÍA Y CONFIGURACIÓN
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

-- =====================================================
-- V006: FOREIGN KEYS Y RELACIONES
-- =====================================================

-- Foreign Keys para users
ALTER TABLE users ADD CONSTRAINT fk_users_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);
ALTER TABLE users ADD CONSTRAINT fk_users_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Foreign Keys para teams
ALTER TABLE teams ADD CONSTRAINT fk_teams_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);

-- Foreign Keys para team_memberships
ALTER TABLE team_memberships ADD CONSTRAINT fk_team_memberships_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE team_memberships ADD CONSTRAINT fk_team_memberships_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE;

-- Foreign Keys para task_categories
ALTER TABLE task_categories ADD CONSTRAINT fk_task_categories_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id);
ALTER TABLE task_categories ADD CONSTRAINT fk_task_categories_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);

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

-- Foreign Keys para task_assignments
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE task_assignments ADD CONSTRAINT fk_task_assignments_assigned_by 
    FOREIGN KEY (assigned_by) REFERENCES users(id);

-- Foreign Keys para notifications
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE notifications ADD CONSTRAINT fk_notifications_related_user_id 
    FOREIGN KEY (related_user_id) REFERENCES users(id);

-- Foreign Keys para notification_templates
ALTER TABLE notification_templates ADD CONSTRAINT fk_notification_templates_created_by 
    FOREIGN KEY (created_by) REFERENCES users(id);

-- Foreign Keys para activity_logs
ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_logs_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id);

-- Foreign Keys para user_sessions
ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE user_sessions ADD CONSTRAINT fk_user_sessions_revoked_by 
    FOREIGN KEY (revoked_by) REFERENCES users(id);

-- Foreign Keys para system_settings
ALTER TABLE system_settings ADD CONSTRAINT fk_system_settings_updated_by 
    FOREIGN KEY (updated_by) REFERENCES users(id);

-- Foreign Keys para generated_reports
ALTER TABLE generated_reports ADD CONSTRAINT fk_generated_reports_team_id 
    FOREIGN KEY (team_id) REFERENCES teams(id);
ALTER TABLE generated_reports ADD CONSTRAINT fk_generated_reports_generated_by 
    FOREIGN KEY (generated_by) REFERENCES users(id);

-- Foreign Keys para task_comments
ALTER TABLE task_comments ADD CONSTRAINT fk_task_comments_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE task_comments ADD CONSTRAINT fk_task_comments_user_id 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
ALTER TABLE task_comments ADD CONSTRAINT fk_task_comments_parent_comment_id 
    FOREIGN KEY (parent_comment_id) REFERENCES task_comments(id);

-- Foreign Keys para task_attachments
ALTER TABLE task_attachments ADD CONSTRAINT fk_task_attachments_task_id 
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE;
ALTER TABLE task_attachments ADD CONSTRAINT fk_task_attachments_uploaded_by 
    FOREIGN KEY (uploaded_by) REFERENCES users(id);

-- =====================================================
-- V007: ÍNDICES, TRIGGERS Y CONFIGURACIÓN FINAL
-- =====================================================

-- Índices para performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_team_id ON tasks(team_id);
CREATE INDEX idx_tasks_category_id ON tasks(category_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_status_due_date ON tasks(status, due_date);
CREATE INDEX idx_tasks_team_status ON tasks(team_id, status);

CREATE INDEX idx_task_assignments_task_id ON task_assignments(task_id);
CREATE INDEX idx_task_assignments_user_id ON task_assignments(user_id);
CREATE INDEX idx_task_assignments_active ON task_assignments(is_active) WHERE is_active = true;

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_task_id ON notifications(task_id) WHERE task_id IS NOT NULL;

CREATE INDEX idx_activity_logs_user_id_time ON activity_logs(user_id, occurred_at DESC);
CREATE INDEX idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX idx_activity_logs_time ON activity_logs(occurred_at DESC);

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at 
    BEFORE UPDATE ON teams 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_task_categories_updated_at 
    BEFORE UPDATE ON task_categories 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_settings_updated_at 
    BEFORE UPDATE ON system_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

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

CREATE TRIGGER update_task_assignee_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON task_assignments
    FOR EACH ROW EXECUTE FUNCTION update_task_assignee_count();

-- Función para logging automático
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

CREATE TRIGGER log_task_changes_trigger
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION log_task_changes();

-- Vistas para analítica
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
    COUNT(ta.id) as total_assignments
FROM users u
LEFT JOIN task_assignments ta ON u.id = ta.user_id AND ta.is_active = true
LEFT JOIN tasks t ON ta.task_id = t.id
WHERE u.is_active = true
GROUP BY u.id, u.name, u.email, u.role;

CREATE OR REPLACE VIEW task_statistics AS
SELECT 
    DATE_TRUNC('week', t.created_at) as week,
    COUNT(*) as tasks_created,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as tasks_completed,
    COUNT(CASE WHEN t.status = 'active' THEN 1 END) as tasks_active,
    ROUND(AVG(t.cost), 2) as avg_cost,
    ROUND(SUM(t.cost), 2) as total_cost,
    ROUND(AVG(t.estimated_hours), 2) as avg_estimated_hours
FROM tasks t
WHERE t.created_at >= CURRENT_DATE - INTERVAL '12 weeks'
GROUP BY DATE_TRUNC('week', t.created_at)
ORDER BY week DESC;

-- Configuración RLS para Supabase
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS básicas
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS(
            SELECT 1 FROM users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can view assigned tasks" ON tasks
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
    );

-- Datos iniciales
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"Puul Tasks API"', 'Nombre de la aplicación', true),
('notification_enabled', 'true', 'Notificaciones habilitadas globalmente', false),
('max_file_size', '52428800', 'Tamaño máximo de archivo en bytes (50MB)', false),
('default_timezone', '"UTC"', 'Zona horaria por defecto', true),
('task_due_date_buffer_days', '30', 'Días máximos hacia el futuro para fecha de vencimiento', false);

INSERT INTO notification_templates (name, type, channel, subject_template, body_template, variables) VALUES
('task_reminder_3_days', 'REMINDER_3_DAYS', 'email', 
 'Recordatorio: {{task_title}} vence en 3 días', 
 'Hola {{user_name}},\n\nTe recordamos que la tarea "{{task_title}}" vence el {{due_date}}.\n\nTiempo estimado: {{estimated_hours}} horas\nCosto: ${{task_cost}}\n\n¡Que tengas un excelente día!',
 '["user_name", "task_title", "due_date", "estimated_hours", "task_cost"]'),
 
('task_assigned', 'TASK_ASSIGNED', 'email',
 'Nueva tarea asignada: {{task_title}}',
 'Hola {{user_name}},\n\nSe te ha asignado una nueva tarea:\n\n**{{task_title}}**\n\n{{task_description}}\n\nFecha de vencimiento: {{due_date}}\nTiempo estimado: {{estimated_hours}} horas\n\nAsignado por: {{assigned_by}}',
 '["user_name", "task_title", "task_description", "due_date", "estimated_hours", "assigned_by"]');

INSERT INTO task_categories (name, description, color) VALUES
('Desarrollo', 'Tareas relacionadas con desarrollo de software', '#10B981'),
('Diseño', 'Tareas de diseño UI/UX', '#8B5CF6'),
('Testing', 'Pruebas y QA', '#F59E0B'),
('Documentación', 'Creación y actualización de documentación', '#6B7280'),
('Reuniones', 'Reuniones y coordinación', '#EF4444');

-- Comentario de la base de datos
COMMENT ON DATABASE postgres IS 'Base de datos para la API de gestión de tareas de Puul';

-- =====================================================
-- FIN DE MIGRACIÓN
-- =====================================================
SELECT 'Migración completada exitosamente. Base de datos Puul Tasks API lista para usar.' as status;