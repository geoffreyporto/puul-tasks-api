// src/modules/tasks/entities/task-attachment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Check,
    JoinColumn,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from '../../users/entities/user.entity';
  import { Task } from './task.entity';
  
  @Entity('task_attachments')
  @Check(`"file_size" > 0`)
  @Check(`"file_size" <= 52428800`) // 50MB limit
  export class TaskAttachment {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    task_id: string;
  
    @Column()
    uploaded_by_id: string;
  
    @ApiProperty({ description: 'Processed filename' })
    @Column({ length: 255 })
    filename: string;
  
    @ApiProperty({ description: 'Original filename' })
    @Column({ length: 255 })
    original_filename: string;
  
    @ApiProperty({ description: 'File size in bytes' })
    @Column({ type: 'bigint' })
    file_size: number;
  
    @ApiProperty({ description: 'File MIME type' })
    @Column({ length: 255 })
    mime_type: string;
  
    @ApiProperty({ description: 'File URL' })
    @Column({ type: 'text' })
    file_url: string;
  
    @ApiProperty({ description: 'Upload timestamp' })
    @CreateDateColumn()
    uploaded_at: Date;
  
    // Relaciones
    @ManyToOne(() => Task, task => task.attachments)
    @JoinColumn({ name: 'task_id' })
    task: Task;
  
    @ManyToOne(() => User)
    @JoinColumn({ name: 'uploaded_by_id' })
    uploaded_by: User;
  
    // Propiedades calculadas
    get file_size_mb(): number {
      return Math.round((this.file_size / 1024 / 1024) * 100) / 100;
    }
  }