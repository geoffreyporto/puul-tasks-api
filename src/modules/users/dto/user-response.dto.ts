// src/modules/users/dto/user-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserWithStatsDto {
  @ApiProperty({ description: 'User ID' })
  id: string;

  @ApiProperty({ description: 'Full name' })
  name: string;

  @ApiProperty({ description: 'Email address' })
  email: string;

  @ApiProperty({ description: 'User role' })
  role: string;

  @ApiProperty({ description: 'URL to user avatar', required: false })
  avatar_url?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  phone?: string;

  @ApiProperty({ description: 'User timezone', required: false })
  timezone?: string;

  @ApiProperty({ description: 'Active status' })
  is_active: boolean;

  @ApiProperty({ description: 'Last login timestamp', required: false })
  last_login_at?: Date;

  @ApiProperty({ description: 'Created timestamp' })
  created_at: Date;

  @ApiProperty({ description: 'Updated timestamp', required: false })
  updated_at?: Date;

  @ApiProperty({ description: 'Number of completed tasks' })
  completed_tasks: number;

  @ApiProperty({ description: 'Number of active tasks' })
  active_tasks: number;

  @ApiProperty({ description: 'Number of overdue tasks' })
  overdue_tasks: number;

  @ApiProperty({ description: 'Total value of completed tasks' })
  total_completed_value: number;

  @ApiProperty({ description: 'Total task assignments' })
  total_assignments: number;

  @ApiProperty({ description: 'Productivity score' })
  productivity_score: number;
}
