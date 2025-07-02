-- =====================================================
-- INITIAL DATA AND FINAL CONFIGURATION
-- Supabase Migration: 20241201000012_insert_initial_data.sql
-- =====================================================

-- =====================================================
-- CONFIGURACIONES DEL SISTEMA
-- =====================================================

INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', '"Puul Tasks API"', 'Nombre de la aplicación', true),
('app_version', '"1.0.0"', 'Versión actual de la aplicación', true),
('notification_enabled', 'true', 'Notificaciones habilitadas globalmente', false),
('max_file_size', '52428800', 'Tamaño máximo de archivo en bytes (50MB)', false),
('default_timezone', '"UTC"', 'Zona horaria por defecto', true),
('task_due_date_buffer_days', '30', 'Días máximos hacia el futuro para fecha de vencimiento', false),
('max_task_assignments', '10', 'Máximo número de usuarios asignados por tarea', false),
('session_timeout_hours', '24', 'Tiempo de expiración de sesiones en horas', false),
('password_min_length', '8', 'Longitud mínima de contraseñas', false),
('rate_limit_requests_per_minute', '100', 'Límite de requests por minuto por usuario', false),
('email_notifications_default', 'true', 'Notificaciones por email habilitadas por defecto', true),
('maintenance_mode', 'false', 'Modo de mantenimiento activado', false),
('backup_retention_days', '90', 'Días de retención de backups', false)
ON CONFLICT (key) DO NOTHING;

-- =====================================================
-- TEMPLATES DE NOTIFICACIÓN
-- =====================================================

INSERT INTO notification_templates (name, type, channel, subject_template, body_template, variables, is_active) VALUES
('task_reminder_3_days', 'REMINDER_3_DAYS', 'email', 
 'Recordatorio: {{task_title}} vence en 3 días', 
 'Hola {{user_name}},

Te recordamos que la tarea "{{task_title}}" vence el {{due_date}}.

📋 **Detalles de la tarea:**
- Tiempo estimado: {{estimated_hours}} horas
- Costo: ${{task_cost}}
- Prioridad: {{priority}}

{{#task_description}}
**Descripción:**
{{task_description}}
{{/task_description}}

Puedes ver más detalles en el sistema.

¡Que tengas un excelente día!

---
Puul Tasks API',
 '["user_name", "task_title", "due_date", "estimated_hours", "task_cost", "priority", "task_description"]',
 true),

('task_reminder_1_day', 'REMINDER_1_DAY', 'email',
 '⚠️ Recordatorio: {{task_title}} vence mañana',
 'Hola {{user_name}},

⚠️ **RECORDATORIO IMPORTANTE:** La tarea "{{task_title}}" vence mañana ({{due_date}}).

📋 **Detalles:**
- Tiempo estimado: {{estimated_hours}} horas
- Costo: ${{task_cost}}
- Prioridad: {{priority}}

Por favor, asegúrate de completarla a tiempo.

---
Puul Tasks API',
 '["user_name", "task_title", "due_date", "estimated_hours", "task_cost", "priority"]',
 true),

('task_due_today', 'DUE_TODAY', 'email',
 '🚨 URGENTE: {{task_title}} vence HOY',
 'Hola {{user_name}},

🚨 **URGENTE:** La tarea "{{task_title}}" vence HOY ({{due_date}}).

📋 **Detalles:**
- Tiempo estimado: {{estimated_hours}} horas
- Costo: ${{task_cost}}
- Prioridad: {{priority}}

¡Es importante que la completes hoy!

---
Puul Tasks API',
 '["user_name", "task_title", "due_date", "estimated_hours", "task_cost", "priority"]',
 true),

('task_assigned', 'TASK_ASSIGNED', 'email',
 'Nueva tarea asignada: {{task_title}}',
 'Hola {{user_name}},

Se te ha asignado una nueva tarea:

📋 **{{task_title}}**

{{#task_description}}
**Descripción:**
{{task_description}}
{{/task_description}}

**Detalles:**
- Fecha de vencimiento: {{due_date}}
- Tiempo estimado: {{estimated_hours}} horas
- Costo: ${{task_cost}}
- Prioridad: {{priority}}
- Asignado por: {{assigned_by}}

{{#is_primary}}
✅ **Eres el responsable principal de esta tarea.**
{{/is_primary}}

Puedes ver todos los detalles en el sistema.

---
Puul Tasks API',
 '["user_name", "task_title", "task_description", "due_date", "estimated_hours", "task_cost", "priority", "assigned_by", "is_primary"]',
 true),

('task_completed', 'TASK_COMPLETED', 'email',
 '✅ Tarea completada: {{task_title}}',
 'Hola {{user_name}},

✅ ¡Excelente trabajo! La tarea "{{task_title}}" ha sido marcada como completada.

**Detalles finales:**
- Completada el: {{completed_date}}
- Tiempo invertido: {{actual_hours}} horas
- Tiempo estimado: {{estimated_hours}} horas
- Costo: ${{task_cost}}

{{#completed_by}}
Completada por: {{completed_by}}
{{/completed_by}}

¡Gracias por tu dedicación!

---
Puul Tasks API',
 '["user_name", "task_title", "completed_date", "actual_hours", "estimated_hours", "task_cost", "completed_by"]',
 true),

('task_overdue', 'OVERDUE', 'email',
 '🔴 VENCIDA: {{task_title}}',
 'Hola {{user_name}},

🔴 **TAREA VENCIDA:** La tarea "{{task_title}}" venció el {{due_date}} y aún no ha sido completada.

**Detalles:**
- Días de retraso: {{days_overdue}}
- Prioridad: {{priority}}
- Costo: ${{task_cost}}

Por favor, completa esta tarea lo antes posible o contacta a tu supervisor.

---
Puul Tasks API',
 '["user_name", "task_title", "due_date", "days_overdue", "priority", "task_cost"]',
 true)

ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- CATEGORÍAS DE TAREAS PREDETERMINADAS
-- =====================================================

INSERT INTO task_categories (name, description, color, is_active) VALUES
('Desarrollo', 'Tareas relacionadas con desarrollo de software', '#10B981', true),
('Diseño', 'Tareas de diseño UI/UX y gráfico', '#8B5CF6', true),
('Testing', 'Pruebas, QA y control de calidad', '#F59E0B', true),
('Documentación', 'Creación y actualización de documentación', '#6B7280', true),
('Reuniones', 'Reuniones y coordinación de equipos', '#EF4444', true),
('Marketing', 'Tareas de marketing y promoción', '#EC4899', true),
('Soporte', 'Soporte técnico y atención al cliente', '#06B6D4', true),
('Administración', 'Tareas administrativas y gestión', '#84CC16', true),
('Investigación', 'Investigación y análisis', '#F97316', true),
('Capacitación', 'Formación y desarrollo profesional', '#8B5CF6', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- USUARIO ADMINISTRADOR INICIAL (OPCIONAL)
-- =====================================================

-- Crear usuario admin inicial solo si no existe
-- Nota: En producción, este usuario debe ser creado con una contraseña segura
INSERT INTO users (
    id,
    email, 
    name, 
    role, 
    password_hash,
    is_active,
    email_verified_at,
    created_at
) VALUES (
    'a0000000-0000-0000-0000-000000000000',
    'admin@puul.com',
    'Administrador Puul',
    'admin',
    '$2b$10$rGfI8p8P8p8P8p8P8p8P8u', -- Placeholder hash - CAMBIAR EN PRODUCCIÓN
    true,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- CONFIGURACIÓN FINAL
-- =====================================================

-- Comentario de la base de datos
COMMENT ON DATABASE postgres IS 'Base de datos para la API de gestión de tareas de Puul - v1.0.0';

-- Insertar registro de inicialización
INSERT INTO activity_logs (
    action,
    resource_type,
    resource_id,
    new_values,
    occurred_at
) VALUES (
    'DATABASE_INITIALIZED',
    'SYSTEM',
    'a0000000-0000-0000-0000-000000000000',
    jsonb_build_object(
        'version', '1.0.0',
        'migration_date', CURRENT_TIMESTAMP,
        'tables_created', 15,
        'initial_categories', 10,
        'notification_templates', 6
    ),
    CURRENT_TIMESTAMP
);

-- Verificación final
DO $$
DECLARE
    table_count INTEGER;
    view_count INTEGER;
    function_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO table_count 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    
    SELECT COUNT(*) INTO view_count 
    FROM information_schema.views 
    WHERE table_schema = 'public';
    
    SELECT COUNT(*) INTO function_count 
    FROM information_schema.routines 
    WHERE routine_schema = 'public' AND routine_type = 'FUNCTION';
    
    RAISE NOTICE 'Migración completada exitosamente:';
    RAISE NOTICE '- Tablas creadas: %', table_count;
    RAISE NOTICE '- Vistas creadas: %', view_count;
    RAISE NOTICE '- Funciones creadas: %', function_count;
    RAISE NOTICE '- Base de datos Puul Tasks API lista para usar.';
END $$;

-- Mensaje final
SELECT 
    'Migración completada exitosamente. Base de datos Puul Tasks API lista para usar.' as status,
    CURRENT_TIMESTAMP as completed_at;