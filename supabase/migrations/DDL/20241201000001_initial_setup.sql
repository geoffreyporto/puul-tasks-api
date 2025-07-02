-- =====================================================
-- INITIAL SETUP: EXTENSIONS AND ENUMS
-- Supabase Migration: 20241201000001_initial_setup.sql
-- =====================================================

-- Habilitar extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Configurar timezone por defecto
SET timezone = 'UTC';

-- =====================================================
-- ENUMERACIONES (ENUMS)
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

-- Comentarios
COMMENT ON TYPE user_role IS 'Roles de usuario: member (miembro) o admin (administrador)';
COMMENT ON TYPE task_status IS 'Estados de tarea: active, completed, cancelled, on_hold';
COMMENT ON TYPE task_priority IS 'Prioridades de tarea: low, medium, high, urgent';
COMMENT ON TYPE notification_type IS 'Tipos de notificación del sistema';
COMMENT ON TYPE notification_status IS 'Estados de las notificaciones';
COMMENT ON TYPE notification_channel IS 'Canales de envío de notificaciones';