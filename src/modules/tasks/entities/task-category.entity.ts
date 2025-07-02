// src/modules/tasks/entities/task-category.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '../../users/entities/user.entity';
  import { Team } from '../../teams/entities/team.entity';
  import { Task } from './task.entity';
  
  @Entity('task_categories')
  export class TaskCategory {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @ApiProperty({ description: 'Category name' })
    @Column({ length: 255 })
    name: string;
  
    @ApiProperty({ description: 'Category description', required: false })
    @Column({ nullable: true, type: 'text' })
    description?: string;
  
    @ApiProperty({ description: 'Category color in hex format' })
    @Column({ default: '#3B82F6', length: 7 })
    color: string;
  
    @Column({ nullable: true })
    team_id?: string;
  
    @ApiProperty({ description: 'Whether category is active' })
    @Column({ default: true })
    is_active: boolean;
  
    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    created_at: Date;
  
    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updated_at: Date;
  
    @Column({ nullable: true })
    created_by?: string;
  
    // Relaciones
    @ManyToOne(() => Team, team => team.categories, { nullable: true })
    @JoinColumn({ name: 'team_id' })
    team?: Team;
  
    @ManyToOne(() => User, { nullable: true })
    @JoinColumn({ name: 'created_by' })
    createdByUser?: User;
  
    @OneToMany(() => Task, task => task.category)
    tasks: Task[];
  }