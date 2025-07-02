import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFiltersDto } from './dto/task-filters.dto';
import { TaskResponseDto } from './dto/task-response.dto';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskStatusDistributionQueryDto, TaskStatusDistributionResponseDto } from './dto/task-status-distribution.dto';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: CreateTaskDto): Promise<TaskResponseDto>;
    findAll(filters: TaskFiltersDto): Promise<PaginatedResult<TaskResponseDto>>;
    findOne(id: string): Promise<TaskResponseDto>;
    update(id: string, updateTaskDto: UpdateTaskDto): Promise<TaskResponseDto>;
    remove(id: string): Promise<void>;
    assignTaskToUser(id: string, createAssignmentDto: CreateAssignmentDto): Promise<TaskAssignment>;
    getTaskStatusDistribution(projectId: string, queryParams: TaskStatusDistributionQueryDto): Promise<TaskStatusDistributionResponseDto>;
}
