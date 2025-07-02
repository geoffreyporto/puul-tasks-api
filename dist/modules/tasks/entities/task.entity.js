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
exports.Task = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../users/entities/user.entity");
const team_entity_1 = require("../../teams/entities/team.entity");
const task_category_entity_1 = require("./task-category.entity");
const task_assignment_entity_1 = require("./task-assignment.entity");
const task_comment_entity_1 = require("./task-comment.entity");
const task_attachment_entity_1 = require("./task-attachment.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
let Task = class Task {
    id;
    title;
    description;
    estimated_hours;
    actual_hours;
    cost;
    due_date;
    status;
    priority;
    category_id;
    team_id;
    parent_task_id;
    started_at;
    completed_at;
    created_at;
    updated_at;
    created_by;
    updated_by;
    assignee_count;
    completion_percentage;
    category;
    team;
    parent_task;
    subtasks;
    assignments;
    comments;
    attachments;
    notifications;
    get is_overdue() {
        return this.status === enums_1.TaskStatus.ACTIVE && this.due_date < new Date();
    }
    get is_due_soon() {
        const threeDaysFromNow = new Date();
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        return this.status === enums_1.TaskStatus.ACTIVE && this.due_date <= threeDaysFromNow;
    }
};
exports.Task = Task;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Task.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task title' }),
    (0, typeorm_1.Column)({ length: 500 }),
    __metadata("design:type", String)
], Task.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task description', required: false }),
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Task.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Estimated hours to complete' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 6, scale: 2 }),
    __metadata("design:type", Number)
], Task.prototype, "estimated_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actual hours worked' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 6, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "actual_hours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task monetary cost' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 12, scale: 2 }),
    __metadata("design:type", Number)
], Task.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task due date' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], Task.prototype, "due_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.TaskStatus, description: 'Current task status' }),
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.TaskStatus, default: enums_1.TaskStatus.ACTIVE }),
    __metadata("design:type", String)
], Task.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.TaskPriority, description: 'Task priority' }),
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.TaskPriority, default: enums_1.TaskPriority.MEDIUM }),
    __metadata("design:type", String)
], Task.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "category_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "team_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Task.prototype, "parent_task_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task start date', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "started_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task completion date', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Task.prototype, "completed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Task.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.created_tasks),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", user_entity_1.User)
], Task.prototype, "updated_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of assigned users' }),
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "assignee_count", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Task completion percentage' }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 5, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Task.prototype, "completion_percentage", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_category_entity_1.TaskCategory, category => category.tasks, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'category_id' }),
    __metadata("design:type", task_category_entity_1.TaskCategory)
], Task.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team, team => team.tasks, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'team_id' }),
    __metadata("design:type", team_entity_1.Team)
], Task.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Task, task => task.subtasks, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_task_id' }),
    __metadata("design:type", Task)
], Task.prototype, "parent_task", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task, task => task.parent_task),
    __metadata("design:type", Array)
], Task.prototype, "subtasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_assignment_entity_1.TaskAssignment, assignment => assignment.task),
    __metadata("design:type", Array)
], Task.prototype, "assignments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_comment_entity_1.TaskComment, comment => comment.task),
    __metadata("design:type", Array)
], Task.prototype, "comments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_attachment_entity_1.TaskAttachment, attachment => attachment.task),
    __metadata("design:type", Array)
], Task.prototype, "attachments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, notification => notification.task),
    __metadata("design:type", Array)
], Task.prototype, "notifications", void 0);
exports.Task = Task = __decorate([
    (0, typeorm_1.Entity)('tasks'),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['due_date']),
    (0, typeorm_1.Index)(['created_at']),
    (0, typeorm_1.Index)(['team_id']),
    (0, typeorm_1.Index)(['category_id']),
    (0, typeorm_1.Index)(['status', 'due_date']),
    (0, typeorm_1.Check)(`"estimated_hours" > 0`),
    (0, typeorm_1.Check)(`"actual_hours" >= 0`),
    (0, typeorm_1.Check)(`"cost" >= 0`),
    (0, typeorm_1.Check)(`"completion_percentage" >= 0 AND "completion_percentage" <= 100`)
], Task);
//# sourceMappingURL=task.entity.js.map