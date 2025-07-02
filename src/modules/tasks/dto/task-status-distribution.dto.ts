// src/modules/tasks/dto/task-status-distribution.dto.ts
import { IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TaskStatusDistributionQueryDto {
  @ApiProperty({ description: 'Start date filter in YYYY-MM-DD format', required: false })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiProperty({ description: 'End date filter in YYYY-MM-DD format', required: false })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}

export class TaskStatusDistributionResponseDto {
  @ApiProperty({ description: 'Number of tasks not started yet' })
  not_started: number;

  @ApiProperty({ description: 'Number of tasks in progress' })
  in_progress: number;

  @ApiProperty({ description: 'Number of tasks completed' })
  completed: number;
}
