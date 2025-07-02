// src/modules/tasks/dto/task-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class TaskResponseDto {
  @ApiProperty({ description: 'Task unique identifier' })
  id: string;

  @ApiProperty({ description: 'Task title' })
  title: string;

  @ApiProperty({ description: 'Task description' })
  description: string;

  @ApiProperty({ example: 'active', description: 'Current status of the task' })
  status: string;

  @ApiProperty({ example: 1, description: 'Task priority level' })
  priority: number;

  @ApiProperty({ description: 'Due date for the task' })
  dueDate: string;

  @ApiProperty({ example: 100, description: 'Task cost or value' })
  cost: number;

  @ApiProperty({ example: 8, description: 'Estimated hours to complete' })
  estimated_hours: number;

  @ApiProperty({ example: 10, description: 'Actual hours spent' })
  actual_hours: number;

  @ApiProperty({ description: 'Date when the task was created' })
  created_at: string;

  @ApiProperty({ description: 'Date when the task was last updated' })
  updated_at: string;

  @ApiProperty({ description: 'Date when the task was completed', required: false })
  completedAt?: string;

  @ApiProperty({ description: 'ID of the assigned category', required: false })
  categoryId?: string;

  @ApiProperty({ description: 'Category information', required: false })
  category?: {
    id: string;
    name: string;
    color: string; // Añade esta propiedad
  };

  @ApiProperty({ description: 'ID of parent task, if this is a subtask', required: false })
  parent_task_id?: string;
  
  @ApiProperty({ description: 'Date when the task was started', required: false })
  started_at?: string;

  @ApiProperty({ description: 'Date when the task was completed', required: false })
  completed_at?: string;

  @ApiProperty({ description: 'Name of the user who created the task', required: false })
  created_by_name?: string;

  @ApiProperty({ description: 'Array of assigned user IDs', required: false, type: [String] })
  assignedUserIds: string[] = [];

  @ApiProperty({ description: 'Array of assigned user objects', required: false, type: [Object] })
  assignees: any[] = [];

  @ApiProperty({ description: 'ID of the team this task belongs to', required: false })
  teamId?: string;

  @ApiProperty({ description: 'Name of the team this task belongs to', required: false })
  teamName?: string;

  @ApiProperty({ description: 'Team information', required: false })
  team?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({ description: 'Whether the task is overdue', default: false })
  is_overdue: boolean;

  @ApiProperty({ description: 'Whether the task is due soon (within 3 days)', default: false })
  is_due_soon: boolean;

  @ApiProperty({ description: 'Number of comments on the task', default: 0 })
  comments_count: number;

  @ApiProperty({ description: 'Number of attachments on the task', default: 0 })
  attachments_count: number;

  @ApiProperty({ description: 'Number of assignees on the task', default: 0 })
  assignee_count: number;

  @ApiProperty({ description: 'Percentage of completion', default: 0 })
  completion_percentage: number;
}
