// src/modules/audit/entities/activity-log.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Index,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '../../users/entities/user.entity';
  
  @Entity('activity_logs')
  @Index(['user_id', 'occurred_at'])
  @Index(['resource_type', 'resource_id'])
  @Index(['occurred_at'])
  export class ActivityLog {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ nullable: true })
    user_id?: string;
  
    @ApiProperty({ description: 'Action performed' })
    @Column({ length: 100 })
    action: string;
  
    @ApiProperty({ description: 'Resource type affected' })
    @Column({ length: 50 })
    resource_type: string;
  
    @ApiProperty({ description: 'Resource ID affected', required: false })
    @Column({ nullable: true })
    resource_id?: string;
  
    @ApiProperty({ description: 'Previous values', required: false })
    @Column({ type: 'jsonb', nullable: true })
    old_values?: Record<string, any>;
  
    @ApiProperty({ description: 'New values', required: false })
    @Column({ type: 'jsonb', nullable: true })
    new_values?: Record<string, any>;
  
    @ApiProperty({ description: 'Changed fields only', required: false })
    @Column({ type: 'jsonb', nullable: true })
    changes?: Record<string, any>;
  
    @ApiProperty({ description: 'Client IP address', required: false })
    @Column({ type: 'inet', nullable: true })
    ip_address?: string;
  
    @ApiProperty({ description: 'User agent', required: false })
    @Column({ nullable: true, type: 'text' })
    user_agent?: string;
  
    @ApiProperty({ description: 'Session ID', required: false })
    @Column({ nullable: true, length: 255 })
    session_id?: string;
  
    @ApiProperty({ description: 'When action occurred' })
    @CreateDateColumn()
    occurred_at: Date;
  
    // Relaciones
    @ManyToOne(() => User, user => user.activity_logs, { nullable: true })
    @JoinColumn({ name: 'user_id' })
    user?: User;
  }
  