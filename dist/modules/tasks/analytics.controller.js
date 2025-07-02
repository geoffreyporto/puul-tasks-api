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
exports.TaskAnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tasks_service_1 = require("./tasks.service");
const task_status_distribution_dto_1 = require("./dto/task-status-distribution.dto");
let TaskAnalyticsController = class TaskAnalyticsController {
    tasksService;
    constructor(tasksService) {
        this.tasksService = tasksService;
    }
    async getTaskStatusDistribution(queryParams) {
        return this.tasksService.getTaskStatusDistribution(queryParams.start_date, queryParams.end_date);
    }
};
exports.TaskAnalyticsController = TaskAnalyticsController;
__decorate([
    (0, common_1.Get)('tasks/status-distribution'),
    (0, swagger_1.ApiOperation)({ summary: 'Get task status distribution across the system' }),
    (0, swagger_1.ApiQuery)({ type: task_status_distribution_dto_1.TaskStatusDistributionQueryDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Task status distribution retrieved successfully', type: task_status_distribution_dto_1.TaskStatusDistributionResponseDto }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [task_status_distribution_dto_1.TaskStatusDistributionQueryDto]),
    __metadata("design:returntype", Promise)
], TaskAnalyticsController.prototype, "getTaskStatusDistribution", null);
exports.TaskAnalyticsController = TaskAnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Task Analytics'),
    (0, common_1.Controller)('api/v1/analytics'),
    __metadata("design:paramtypes", [tasks_service_1.TasksService])
], TaskAnalyticsController);
//# sourceMappingURL=analytics.controller.js.map