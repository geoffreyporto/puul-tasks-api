import { IsOptional, IsString, IsNumber, IsUUID, IsArray, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../../common/enums';

export class UpdateTaskDto {
    @ApiPropertyOptional({ description: 'Task title' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: 'Task description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Task status', enum: TaskStatus })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: string;

    @ApiPropertyOptional({ description: 'Task priority', enum: TaskPriority })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: string;

    @ApiPropertyOptional({ description: 'Task due date (ISO format)' })
    @IsOptional()
    @IsString()
    dueDate?: string;
    
    @ApiPropertyOptional({ description: 'Date when task was completed (ISO format)' })
    @IsOptional()
    @IsString()
    completedAt?: string;

    @ApiPropertyOptional({ description: 'Task cost/value' })
    @IsOptional()
    @IsNumber()
    cost?: number;

    @ApiPropertyOptional({ description: 'IDs of users assigned to the task' })
    @IsOptional()
    @IsArray()
    @IsUUID(undefined, { each: true })
    assignedUserIds?: string[];

    @ApiPropertyOptional({ description: 'Task category ID' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ description: 'Team ID' })
    @IsOptional()
    @IsUUID()
    teamId?: string;
}