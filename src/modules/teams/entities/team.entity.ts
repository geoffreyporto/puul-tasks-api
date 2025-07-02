// src/modules/teams/entities/team.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { TaskCategory } from '../../tasks/entities/task-category.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TeamMembership } from './team-membership.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;
  
  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true, name: 'logo_url' })
  logoUrl: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @OneToMany(() => TaskCategory, category => category.team)
  categories: TaskCategory[];

  @OneToMany(() => Task, task => task.team)
  tasks: Task[];

  @OneToMany(() => TeamMembership, membership => membership.team)
  memberships: TeamMembership[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;
}
