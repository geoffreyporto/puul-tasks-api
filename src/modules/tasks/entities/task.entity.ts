// src/modules/tasks/entities/task.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    Index,
    Check,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { TaskStatus, TaskPriority } from '../../../common/enums';
  import { User } from '../../users/entities/user.entity';
  import { Team } from '../../teams/entities/team.entity';
  import { TaskCategory } from './task-category.entity';
  import { TaskAssignment } from './task-assignment.entity';
  import { TaskComment } from './task-comment.entity';
  import { TaskAttachment } from './task-attachment.entity';
  import { Notification } from '../../notifications/entities/notification.entity';
  
  @Entity('tasks')
  @Index(['status'])
  @Index(['due_date'])
  @Index(['created_at'])
  @Index(['team_id'])
  @Index(['category_id'])
  @Index(['status', 'due_date'])
  @Check(`"estimated_hours" > 0`)
  @Check(`"actual_hours" >= 0`)
  @Check(`"cost" >= 0`)
  @Check(`"completion_percentage" >= 0 AND "completion_percentage" <= 100`)
  export class Task {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'Task title' })
    @Column({ length: 500 })
    title: string;
  
    @ApiProperty({ description: 'Task description', required: false })
    @Column({ nullable: true, type: 'text' })
    description?: string;
  
    @ApiProperty({ description: 'Estimated hours to complete' })
    @Column({ type: 'decimal', precision: 6, scale: 2 })
    estimated_hours: number;
  
    @ApiProperty({ description: 'Actual hours worked' })
    @Column({ type: 'decimal', precision: 6, scale: 2, default: 0 })
    actual_hours: number;
  
    @ApiProperty({ description: 'Task monetary cost' })
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    cost: number;
  
    @ApiProperty({ description: 'Task due date' })
    @Column()
    due_date: Date;
  
    @ApiProperty({ enum: TaskStatus, description: 'Current task status' })
    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.ACTIVE })
    status: TaskStatus;
  
    @ApiProperty({ enum: TaskPriority, description: 'Task priority' })
    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    priority: TaskPriority;
  
    @Column({ nullable: true })
    category_id?: string;
  
    @Column({ nullable: true })
    team_id?: string;
  
    @Column({ nullable: true })
    parent_task_id?: string;
  
    @ApiProperty({ description: 'Task start date', required: false })
    @Column({ nullable: true })
    started_at?: Date;
  
    @ApiProperty({ description: 'Task completion date', required: false })
    @Column({ nullable: true })
    completed_at?: Date;
  
    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    created_at: Date;
  
    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => User, user => user.created_tasks)
    @JoinColumn({ name: 'created_by' })
    created_by: User;

    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'updated_by' })
    updated_by?: User;

    @ApiProperty({ description: 'Number of assigned users' })
    @Column({ default: 0 })
    assignee_count: number;
  
    @ApiProperty({ description: 'Task completion percentage' })
    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    completion_percentage: number;
  
    // Relaciones
    @ManyToOne(() => TaskCategory, category => category.tasks, { nullable: true })
    @JoinColumn({ name: 'category_id' })
    category?: TaskCategory;
  
    @ManyToOne(() => Team, team => team.tasks, { nullable: true })
    @JoinColumn({ name: 'team_id' })
    team?: Team;
  
    @ManyToOne(() => Task, task => task.subtasks, { nullable: true })
    @JoinColumn({ name: 'parent_task_id' })
    parent_task?: Task;
  
    @OneToMany(() => Task, task => task.parent_task)
    subtasks: Task[];
  
    @OneToMany(() => TaskAssignment, assignment => assignment.task)
    assignments: TaskAssignment[];
  
    @OneToMany(() => TaskComment, comment => comment.task)
    comments: TaskComment[];
  
    @OneToMany(() => TaskAttachment, attachment => attachment.task)
    attachments: TaskAttachment[];
  
    @OneToMany(() => Notification, notification => notification.task)
    notifications: Notification[];
  
    // Propiedades calculadas
    get is_overdue(): boolean {
      return this.status === TaskStatus.ACTIVE && this.due_date < new Date();
    }
  
    get is_due_soon(): boolean {
      const threeDaysFromNow = new Date();
      threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
      return this.status === TaskStatus.ACTIVE && this.due_date <= threeDaysFromNow;
    }
  }