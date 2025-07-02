// =====================================================
// INTEGRACIÓN NESTJS + TYPEORM - ENTIDADES DEL MODELO
// Entidades TypeORM para el modelo de datos de Puul Tasks API
// =====================================================

// src/common/enums/index.ts
export enum UserRole {
  ADMIN = 'admin',
  MANAGER = 'manager',
  MEMBER = 'member',
  CLIENT = 'client',
}

/*
    CANCELLED = 'cancelled',
    ON_HOLD = 'on_hold',
*/
export enum TaskStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
}

/*
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
*/
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationType {
  REMINDER_3_DAYS = 'REMINDER_3_DAYS',
  REMINDER_1_DAY = 'REMINDER_1_DAY',
  DUE_TODAY = 'DUE_TODAY',
  OVERDUE = 'OVERDUE',
  ESCALATION = 'ESCALATION',
  TASK_ASSIGNED = 'TASK_ASSIGNED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_UPDATED = 'TASK_UPDATED',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  IN_APP = 'in_app',
  SLACK = 'slack',
  TEAMS = 'teams',
  WHATSAPP = 'whatsapp',
  TELEGRAM = 'telegram',
  DISCORD = 'discord',
}