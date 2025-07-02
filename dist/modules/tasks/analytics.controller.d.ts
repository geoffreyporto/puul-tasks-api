import { TasksService } from './tasks.service';
import { TaskStatusDistributionQueryDto, TaskStatusDistributionResponseDto } from './dto/task-status-distribution.dto';
export declare class TaskAnalyticsController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    getTaskStatusDistribution(queryParams: TaskStatusDistributionQueryDto): Promise<TaskStatusDistributionResponseDto>;
}
