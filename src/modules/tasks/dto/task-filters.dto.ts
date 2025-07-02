import { IsOptional, IsString, IsNumber, IsUUID, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskStatus, TaskPriority } from '../../../common/enums';

export class TaskFiltersDto {
    @ApiPropertyOptional({ description: 'Filter tasks by title (partial match)' })
    @IsOptional()
    @IsString()
    title?: string;

    @ApiPropertyOptional({ description: 'Filter tasks by status', enum: TaskStatus })
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: string;

    @ApiPropertyOptional({ description: 'Filter tasks by priority', enum: TaskPriority })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: number;

    @ApiPropertyOptional({ description: 'Filter tasks assigned to a specific user' })
    @IsOptional()
    @IsUUID()
    assignedUserId?: string;

    @ApiPropertyOptional({ description: 'Filter tasks by category' })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiPropertyOptional({ description: 'Filter tasks by team' })
    @IsOptional()
    @IsUUID()
    teamId?: string;
    
    @ApiPropertyOptional({ description: 'Due date filter (tasks due before this date)' })
    @IsOptional()
    @IsString()
    dueDate?: string;
    
    @ApiPropertyOptional({ description: 'Search by assigned user name or email' })
    @IsOptional()
    @IsString()
    assignedUser?: string;
    
    @ApiPropertyOptional({ description: 'Sort direction and field, e.g. "created_at:desc"' })
    @IsOptional()
    @IsString()
    sort?: string;

    @ApiPropertyOptional({ description: 'Page number', default: 1 })
    @IsOptional()
    @IsNumber()
    page: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', default: 10 })
    @IsOptional()
    @IsNumber()
    limit: number = 10;

    get offset(): number {
      return (this.page - 1) * this.limit;
    }
}