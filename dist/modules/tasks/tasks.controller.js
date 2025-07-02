"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksController = void 0;
const common_1 = require("@nestjs/common");
const tasks_service_1 = require("./tasks.service");
const swagger_1 = require("@nestjs/swagger");
const create_task_dto_1 = require("./dto/create-task.dto");
const update_task_dto_1 = require("./dto/update-task.dto");
const task_filters_dto_1 = require("./dto/task-filters.dto");
const task_response_dto_1 = require("./dto/task-response.dto");
const create_assignment_dto_1 = require("./dto/create-assignment.dto");
const task_status_distribution_dto_1 = require("./dto/task-status-distribution.dto");
let TasksController = class TasksController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async create(createTaskDto) {
        const createdBy = 'user-id-from-auth';
        return this.tasksService.create(createTaskDto, createdBy);
    }
    async findAll(filters) {
        return this.tasksService.findAll(filters);
    }
    async findOne(id) {
        return this.tasksService.findOne(id);
    }
    async update(id, updateTaskDto) {
        const updatedBy = 'user-id-from-auth';
        return this.tasksService.update(id, updateTaskDto, updatedBy);
    }
    async remove(id) {
        return this.tasksService.remove(id);
    }
    async assignTaskToUser(id, createAssignmentDto) {
        const createdBy = createAssignmentDto.assignedBy;
        const taskId = createAssignmentDto.taskId;
        return this.tasksService.assignTaskToUser(createAssignmentDto, createdBy);
    }
    async getTaskStatusDistribution(projectId, queryParams) {
        return this.tasksService.getTaskStatusDistribution(queryParams.start_date, queryParams.end_date);
    }
};
exports.TasksController = TasksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new task' }),
    (0, swagger_1.ApiBody)({ type: create_task_dto_1.CreateTaskDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task created successfully', type: task_response_dto_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_task_dto_1.CreateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all tasks with filtering' }),
    (0, swagger_1.ApiQuery)({ type: task_filters_dto_1.TaskFiltersDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tasks retrieved successfully', type: [task_response_dto_1.TaskResponseDto] }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_filters_dto_1.TaskFiltersDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task retrieved successfully', type: task_response_dto_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Update task' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiBody)({ type: update_task_dto_1.UpdateTaskDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task updated successfully', type: task_response_dto_1.TaskResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_task_dto_1.UpdateTaskDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete task' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: 'Task deleted successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task not found' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/assignments'),
    (0, swagger_1.ApiOperation)({ summary: 'Assign task to users' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'Task ID' }),
    (0, swagger_1.ApiBody)({ type: create_assignment_dto_1.CreateAssignmentDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Task assigned successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Task or user not found' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_assignment_dto_1.CreateAssignmentDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "assignTaskToUser", null);
__decorate([
    (0, common_1.Get)(':projectId/analytics/tasks/status-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task status distribution by project' }),
    (0, swagger_1.ApiParam)({ name: 'projectId', description: 'Project/Team ID' }),
    (0, swagger_1.ApiQuery)({ type: task_status_distribution_dto_1.TaskStatusDistributionQueryDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status distribution retrieved successfully', type: task_status_distribution_dto_1.TaskStatusDistributionResponseDto }),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, task_status_distribution_dto_1.TaskStatusDistributionQueryDto]),
    __metadata("design:returntype", Promise)
], TasksController.prototype, "getTaskStatusDistribution", null);
exports.TasksController = TasksController = __decorate([
    (0, swagger_1.ApiTags)('Tasks'),
    (0, common_1.Controller)('api/v1/tasks'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TasksController);
//# sourceMappingURL=tasks.controller.js.map