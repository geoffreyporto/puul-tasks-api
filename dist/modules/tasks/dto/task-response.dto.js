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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class TaskResponseDto {
    id;
    title;
    description;
    status;
    priority;
    dueDate;
    cost;
    estimated_hours;
    actual_hours;
    created_at;
    updated_at;
    completedAt;
    categoryId;
    category;
    parent_task_id;
    started_at;
    completed_at;
    created_by_name;
    assignedUserIds = [];
    assignees = [];
    teamId;
    teamName;
    team;
    is_overdue;
    is_due_soon;
    comments_count;
    attachments_count;
    assignee_count;
    completion_percentage;
}
exports.TaskResponseDto = TaskResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task unique identifier' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task title' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task description' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'active', description: 'Current status of the task' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Task priority level' }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "priority", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date for the task' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 100, description: 'Task cost or value' }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8, description: 'Estimated hours to complete' }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "estimated_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Actual hours spent' }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "actual_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the task was created' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the task was last updated' }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the task was completed', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "completedAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the assigned category', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "categoryId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category information', required: false }),
    __metadata("design:type", Object)
], TaskResponseDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of parent task, if this is a subtask', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "parent_task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the task was started', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "started_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Date when the task was completed', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "completed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the user who created the task', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "created_by_name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of assigned user IDs', required: false, type: [String] }),
    __metadata("design:type", Array)
], TaskResponseDto.prototype, "assignedUserIds", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of assigned user objects', required: false, type: [Object] }),
    __metadata("design:type", Array)
], TaskResponseDto.prototype, "assignees", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'ID of the team this task belongs to', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "teamId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Name of the team this task belongs to', required: false }),
    __metadata("design:type", String)
], TaskResponseDto.prototype, "teamName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Team information', required: false }),
    __metadata("design:type", Object)
], TaskResponseDto.prototype, "team", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the task is overdue', default: false }),
    __metadata("design:type", Boolean)
], TaskResponseDto.prototype, "is_overdue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether the task is due soon (within 3 days)', default: false }),
    __metadata("design:type", Boolean)
], TaskResponseDto.prototype, "is_due_soon", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of comments on the task', default: 0 }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "comments_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of attachments on the task', default: 0 }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "attachments_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of assignees on the task', default: 0 }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "assignee_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Percentage of completion', default: 0 }),
    __metadata("design:type", Number)
], TaskResponseDto.prototype, "completion_percentage", void 0);
//# sourceMappingURL=task-response.dto.js.map