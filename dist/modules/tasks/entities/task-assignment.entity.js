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
exports.TaskAssignment = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const task_entity_1 = require("./task.entity");
let TaskAssignment = class TaskAssignment {
    id;
    task_id;
    user_id;
    assigned_at;
    assigned_by;
    is_primary;
    hours_allocated;
    notes;
    accepted_at;
    completed_at;
    is_active;
    task;
    user;
    assignedByUser;
};
exports.TaskAssignment = TaskAssignment;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskAssignment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskAssignment.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskAssignment.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assignment timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskAssignment.prototype, "assigned_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskAssignment.prototype, "assigned_by", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether user is primary responsible' }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TaskAssignment.prototype, "is_primary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Hours allocated to this user', required: false }),
    (0, typeorm_1.Column)({ type: 'decimal', precision: 6, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], TaskAssignment.prototype, "hours_allocated", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assignment notes', required: false }),
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], TaskAssignment.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assignment acceptance timestamp', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], TaskAssignment.prototype, "accepted_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Assignment completion timestamp', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], TaskAssignment.prototype, "completed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether assignment is active' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TaskAssignment.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, task => task.assignments),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_entity_1.Task)
], TaskAssignment.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.task_assignments),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TaskAssignment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'assigned_by' }),
    __metadata("design:type", user_entity_1.User)
], TaskAssignment.prototype, "assignedByUser", void 0);
exports.TaskAssignment = TaskAssignment = __decorate([
    (0, typeorm_1.Entity)('task_assignments'),
    (0, typeorm_1.Unique)(['task_id', 'user_id', 'is_active']),
    (0, typeorm_1.Check)(`"hours_allocated" > 0`)
], TaskAssignment);
//# sourceMappingURL=task-assignment.entity.js.map