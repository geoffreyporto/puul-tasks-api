import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFiltersDto } from './dto/task-filters.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskStatusDistributionQueryDto, TaskStatusDistributionResponseDto } from './dto/task-status-distribution.dto';

@ApiTags('Tasks')
@Controller('api/v1/tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  @ApiBody({ type: CreateTaskDto })
  @ApiResponse({ status: 201, description: 'Task created successfully', type: TaskResponseDto })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createTaskDto: CreateTaskDto): Promise<TaskResponseDto> {
    // En un entorno real, obtendrías el ID del usuario autenticado
    const createdBy = 'user-id-from-auth';
    return this.tasksService.create(createTaskDto, createdBy);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tasks with filtering' })
  @ApiQuery({ type: TaskFiltersDto })
  @ApiResponse({ status: 200, description: 'Tasks retrieved successfully', type: [TaskResponseDto] })
  async findAll(@Query() filters: TaskFiltersDto): Promise<PaginatedResult<TaskResponseDto>> {
    return this.tasksService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 200, description: 'Task retrieved successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async findOne(@Param('id') id: string): Promise<TaskResponseDto> {
    return this.tasksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: UpdateTaskDto })
  @ApiResponse({ status: 200, description: 'Task updated successfully', type: TaskResponseDto })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<TaskResponseDto> {
    // En un entorno real, obtendrías el ID del usuario autenticado
    const updatedBy = 'user-id-from-auth';
    return this.tasksService.update(id, updateTaskDto, updatedBy);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete task' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiResponse({ status: 204, description: 'Task deleted successfully' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.tasksService.remove(id);
  }

  @Post(':id/assignments')
  @ApiOperation({ summary: 'Assign task to users' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiBody({ type: CreateAssignmentDto })
  @ApiResponse({ status: 201, description: 'Task assigned successfully' })
  @ApiResponse({ status: 404, description: 'Task or user not found' })
  async assignTaskToUser(
    @Param('id') id: string,
    @Body() createAssignmentDto: CreateAssignmentDto,
  ): Promise<TaskAssignment> {
    // Usar el ID proporcionado en el DTO
    const createdBy = createAssignmentDto.assignedBy;
    
    // Asegurar que el taskId en el DTO coincida con el de la URL
    const taskId = createAssignmentDto.taskId;
    
    return this.tasksService.assignTaskToUser(createAssignmentDto, createdBy);
  }
  
  @Get(':projectId/analytics/tasks/status-distribution')
  @ApiOperation({ summary: 'Get task status distribution by project' })
  @ApiParam({ name: 'projectId', description: 'Project/Team ID' })
  @ApiQuery({ type: TaskStatusDistributionQueryDto })
  @ApiResponse({ status: 200, description: 'Task status distribution retrieved successfully', type: TaskStatusDistributionResponseDto })
  async getTaskStatusDistribution(
    @Param('projectId') projectId: string,
    @Query() queryParams: TaskStatusDistributionQueryDto,
  ): Promise<TaskStatusDistributionResponseDto> {
    // Nota: projectId se ignora ya que ahora la analítica es general
    return this.tasksService.getTaskStatusDistribution(
      queryParams.start_date, 
      queryParams.end_date
    );
  }
}
