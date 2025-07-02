// src/modules/tasks/entities/task-comment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    Check,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '../../users/entities/user.entity';
  import { Task } from './task.entity';
  
  @Entity('task_comments')
  @Check(`LENGTH("content") >= 1 AND LENGTH("content") <= 5000`)
  export class TaskComment {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    task_id: string;
  
    @Column()
    user_id: string;
  
    @ApiProperty({ description: 'Comment content' })
    @Column({ type: 'text' })
    content: string;
  
    @ApiProperty({ description: 'Whether comment is internal' })
    @Column({ default: false })
    is_internal: boolean;
  
    @Column({ nullable: true })
    parent_comment_id?: string;
  
    @ApiProperty({ description: 'Creation timestamp' })
    @CreateDateColumn()
    created_at: Date;
  
    @ApiProperty({ description: 'Last update timestamp' })
    @UpdateDateColumn()
    updated_at: Date;
  
    // Relaciones
    @ManyToOne(() => Task, task => task.comments)
    @JoinColumn({ name: 'task_id' })
    task: Task;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;
  
    @ManyToOne(() => TaskComment, comment => comment.replies, { nullable: true })
    @JoinColumn({ name: 'parent_comment_id' })
    parent_comment?: TaskComment;
  
    @OneToMany(() => TaskComment, comment => comment.parent_comment)
    replies: TaskComment[];
  }