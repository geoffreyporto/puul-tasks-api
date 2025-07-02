// src/modules/tasks/analytics.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TasksService } from './tasks.service';
import { TaskStatusDistributionQueryDto, TaskStatusDistributionResponseDto } from './dto/task-status-distribution.dto';

@ApiTags('Task Analytics')
@Controller('api/v1/analytics')
export class TaskAnalyticsController {
  constructor(private readonly tasksService: TasksService) {}

  @Get('tasks/status-distribution')
  @ApiOperation({ summary: 'Get task status distribution across the system' })
  @ApiQuery({ type: TaskStatusDistributionQueryDto })
  @ApiResponse({ status: 200, description: 'Task status distribution retrieved successfully', type: TaskStatusDistributionResponseDto })
  async getTaskStatusDistribution(
    @Query() queryParams: TaskStatusDistributionQueryDto,
  ): Promise<TaskStatusDistributionResponseDto> {
    return this.tasksService.getTaskStatusDistribution(
      queryParams.start_date, 
      queryParams.end_date
    );
  }
}
