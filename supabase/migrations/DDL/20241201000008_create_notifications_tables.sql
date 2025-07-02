-- =====================================================
-- NOTIFICATIONS TABLES
-- Supabase Migration: 20241201000008_create_notifications_tables.sql
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

-- Índices para notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_status ON notifications(status);
CREATE INDEX idx_notifications_scheduled_for ON notifications(scheduled_for);
CREATE INDEX idx_notifications_task_id ON notifications(task_id) WHERE task_id IS NOT NULL;
CREATE INDEX idx_notifications_type_channel ON notifications(type, channel);
CREATE INDEX idx_notifications_pending ON notifications(status, scheduled_for) WHERE status = 'pending';

-- Índices para notification_templates
CREATE INDEX idx_notification_templates_type ON notification_templates(type);
CREATE INDEX idx_notification_templates_active ON notification_templates(is_active) WHERE is_active = true;

-- Trigger para updated_at en notification_templates
CREATE TRIGGER update_notification_templates_updated_at 
    BEFORE UPDATE ON notification_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentarios
COMMENT ON TABLE notifications IS 'Sistema de notificaciones del sistema';
COMMENT ON TABLE notification_templates IS 'Templates reutilizables para notificaciones';
COMMENT ON COLUMN notifications.workflow_id IS 'ID del workflow que generó la notificación';
COMMENT ON COLUMN notifications.workflow_run_id IS 'ID de la ejecución específica del workflow';
COMMENT ON COLUMN notification_templates.variables IS 'Variables disponibles en el template (formato JSON array)';