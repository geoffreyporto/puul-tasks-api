
// src/modules/notifications/entities/notification.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Index,
    Check,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import {
    NotificationType,
    NotificationStatus,
    NotificationChannel,
  } from '../../../common/enums';
  import { User } from '../../users/entities/user.entity';
  import { Task } from '../../tasks/entities/task.entity';
  
  @Entity('notifications')
  @Index(['user_id'])
  @Index(['status'])
  @Index(['scheduled_for'])
  @Index(['task_id'])
  @Check(`"scheduled_for" >= "created_at"`)
  export class Notification {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    user_id: string;
  
    @ApiProperty({ description: 'Notification title' })
    @Column({ length: 255 })
    title: string;
  
    @ApiProperty({ description: 'Notification message' })
    @Column({ type: 'text' })
    message: string;
  
    @ApiProperty({ enum: NotificationType, description: 'Notification type' })
    @Column({ type: 'enum', enum: NotificationType })
    type: NotificationType;
  
    @ApiProperty({ enum: NotificationChannel, description: 'Delivery channel' })
    @Column({ type: 'enum', enum: NotificationChannel })
    channel: NotificationChannel;
  
    @ApiProperty({ enum: NotificationStatus, description: 'Notification status' })
    @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING })
    status: NotificationStatus;
  
    @Column({ nullable: true })
    task_id?: string;
  
    @Column({ nullable: true })
    related_user_id?: string;
  
    @ApiProperty({ description: 'Scheduled delivery time' })
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    scheduled_for: Date;
  
    @ApiProperty({ description: 'Actual delivery time', required: false })
    @Column({ nullable: true })
    sent_at?: Date;
  
    @ApiProperty({ description: 'Delivery confirmation time', required: false })
    @Column({ nullable: true })
    delivered_at?: Date;
  
    @ApiProperty({ description: 'Failure time', required: false })
    @Column({ nullable: true })
    failed_at?: Date;
  
    @ApiProperty({ description: 'Error message', required: false })
    @Column({ nullable: true, type: 'text' })
    error_message?: string;
  
    @ApiProperty({ description: 'Temporal workflow ID', required: false })
    @Column({ nullable: true, length: 255 })
    workflow_id?: string;
  
    @ApiProperty({ description: 'Temporal workflow run ID', required: false })
    @Column({ nullable: true, length: 255 })
    workflow_run_id?: string;
  
    @ApiProperty({ description: 'Read timestamp', required: false })
    @Column({ nullable: true })
    read_at?: Date;
  
    @ApiProperty({ description: 'Click timestamp', required: false })
    @Column({ nullable: true })
    clicked_at?: Date;
  
    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    created_at: Date;
  
    // Relaciones
    @ManyToOne(() => User, user => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => Task, task => task.notifications, { nullable: true })
    @JoinColumn({ name: 'task_id' })
    task?: Task;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'related_user_id' })
    related_user?: User;
  
    // Propiedades calculadas
    get is_read(): boolean {
      return this.read_at !== null;
    }
  
    get is_urgent(): boolean {
      return [
        NotificationType.DUE_TODAY,
        NotificationType.OVERDUE,
        NotificationType.ESCALATION,
      ].includes(this.type);
    }
  }
  