// src/modules/users/entities/user-session.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Index,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { User } from './user.entity';
  
  @Entity('user_sessions')
  @Index(['session_token'])
  @Index(['refresh_token'])
  export class UserSession {
    @ApiProperty({ description: 'Unique identifier' })
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    user_id: string;
  
    @ApiProperty({ description: 'Session token' })
    @Column({ unique: true, length: 255 })
    session_token: string;
  
    @ApiProperty({ description: 'Refresh token', required: false })
    @Column({ unique: true, nullable: true, length: 255 })
    refresh_token?: string;
  
    @ApiProperty({ description: 'Client IP address', required: false })
    @Column({ type: 'inet', nullable: true })
    ip_address?: string;
  
    @ApiProperty({ description: 'User agent', required: false })
    @Column({ nullable: true, type: 'text' })
    user_agent?: string;
  
    @ApiProperty({ description: 'Device information', required: false })
    @Column({ type: 'jsonb', nullable: true })
    device_info?: Record<string, any>;
  
    @ApiProperty({ description: 'Session creation time' })
    @CreateDateColumn()
    created_at: Date;
  
    @ApiProperty({ description: 'Last activity time' })
    @Column({ default: () => 'CURRENT_TIMESTAMP' })
    last_activity_at: Date;
  
    @ApiProperty({ description: 'Session expiration time' })
    @Column()
    expires_at: Date;
  
    @ApiProperty({ description: 'Whether session is active' })
    @Column({ default: true })
    is_active: boolean;
  
    @ApiProperty({ description: 'Session revocation time', required: false })
    @Column({ nullable: true })
    revoked_at?: Date;
  
    @Column({ nullable: true })
    revoked_by_id?: string;
  
    // Relaciones
    @ManyToOne(() => User, user => user.sessions)
    user: User;
  
    @ManyToOne(() => User, { nullable: true })
    revoked_by?: User;
  
    // Propiedades calculadas
    get is_expired(): boolean {
      return this.expires_at < new Date();
    }
  
    get is_valid(): boolean {
      return this.is_active && !this.is_expired && !this.revoked_at;
    }
  }