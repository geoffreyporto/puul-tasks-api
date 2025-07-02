// =====================================================
// ENTIDADES PRINCIPALES
// =====================================================

// src/modules/users/entities/user.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Index,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { Exclude } from 'class-transformer';
  import { UserRole } from '../../../common/enums';
  import { TaskAssignment } from '../../tasks/entities/task-assignment.entity';
  import { Task } from '../../tasks/entities/task.entity';
  import { Notification } from '../../notifications/entities/notification.entity';
  import { ActivityLog } from '../../audit/entities/activity-log.entity';
  import { UserSession } from './user-session.entity';
  import { TeamMembership } from '../../teams/entities/team-membership.entity';
  
  @Entity('users')
  @Index(['email'])
  @Index(['role'])
  @Index(['is_active'])
  export class User {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'User email address' })
    @Column({ unique: true, length: 255 })
    @Index()
    email: string;
  
    @ApiProperty({ description: 'User full name' })
    @Column({ length: 255 })
    name: string;
  
    @ApiProperty({ enum: UserRole, description: 'User role in the system' })
    @Column({ type: 'enum', enum: UserRole, default: UserRole.MEMBER })
    role: UserRole;
  
    @Exclude()
    @Column({ nullable: true, length: 255 })
    password_hash?: string;
  
    @ApiProperty({ description: 'User avatar URL', required: false })
    @Column({ nullable: true })
    avatar_url?: string;
  
    @ApiProperty({ description: 'User phone number', required: false })
    @Column({ nullable: true, length: 20 })
    phone?: string;
  
    @ApiProperty({ description: 'User timezone' })
    @Column({ default: 'UTC', length: 50 })
    timezone: string;
  
    @ApiProperty({ description: 'Whether user is active' })
    @Column({ default: true })
    is_active: boolean;
  
    @ApiProperty({ description: 'Last login timestamp', required: false })
    @Column({ nullable: true })
    last_login_at?: Date;
  
    @ApiProperty({ description: 'Email verification timestamp', required: false })
    @Column({ nullable: true })
    email_verified_at?: Date;
  
    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    created_at: Date;
  
    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updated_at: Date;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    created_by?: User;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'updated_by' })
    updated_by?: User;
  
    // Relaciones
    @OneToMany(() => TaskAssignment, assignment => assignment.user)
    task_assignments: TaskAssignment[];
  
    @OneToMany(() => Task, task => task.created_by)
    created_tasks: Task[];
  
    @OneToMany(() => Notification, notification => notification.user)
    notifications: Notification[];
  
    @OneToMany(() => ActivityLog, log => log.user)
    activity_logs: ActivityLog[];
  
    @OneToMany(() => UserSession, session => session.user)
    sessions: UserSession[];
  
    @OneToMany(() => TeamMembership, membership => membership.user)
    team_memberships: TeamMembership[];
  }
  