// src/modules/tasks/entities/task-assignment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Unique,
    Check,
    JoinColumn
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '../../users/entities/user.entity';
  import { Task } from './task.entity';
  
  @Entity('task_assignments')
  @Unique(['task_id', 'user_id', 'is_active'])
  @Check(`"hours_allocated" > 0`)
  export class TaskAssignment {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    task_id: string;
  
    @Column()
    user_id: string;
  
    @ApiProperty({ description: 'Assignment timestamp' })
    @CreateDateColumn()
    assigned_at: Date;
  
    @Column()
    assigned_by: string;
  
    @ApiProperty({ description: 'Whether user is primary responsible' })
    @Column({ default: false })
    is_primary: boolean;
  
    @ApiProperty({ description: 'Hours allocated to this user', required: false })
    @Column({ type: 'decimal', precision: 6, scale: 2, nullable: true })
    hours_allocated?: number;
  
    @ApiProperty({ description: 'Assignment notes', required: false })
    @Column({ nullable: true, type: 'text' })
    notes?: string;
  
    @ApiProperty({ description: 'Assignment acceptance timestamp', required: false })
    @Column({ nullable: true })
    accepted_at?: Date;
  
    @ApiProperty({ description: 'Assignment completion timestamp', required: false })
    @Column({ nullable: true })
    completed_at?: Date;
  
    @ApiProperty({ description: 'Whether assignment is active' })
    @Column({ default: true })
    is_active: boolean;
  
    // Relaciones
    @ManyToOne(() => Task, task => task.assignments)
    @JoinColumn({ name: 'task_id' })
    task: Task;
  
    @ManyToOne(() => User, user => user.task_assignments)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'assigned_by' })
    assignedByUser: User;
  }