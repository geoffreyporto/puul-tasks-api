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
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../users/entities/user.entity");
const task_entity_1 = require("../../tasks/entities/task.entity");
let Notification = class Notification {
    id;
    user_id;
    title;
    message;
    type;
    channel;
    status;
    task_id;
    related_user_id;
    scheduled_for;
    sent_at;
    delivered_at;
    failed_at;
    error_message;
    workflow_id;
    workflow_run_id;
    read_at;
    clicked_at;
    created_at;
    user;
    task;
    related_user;
    get is_read() {
        return this.read_at !== null;
    }
    get is_urgent() {
        return [
            enums_1.NotificationType.DUE_TODAY,
            enums_1.NotificationType.OVERDUE,
            enums_1.NotificationType.ESCALATION,
        ].includes(this.type);
    }
};
exports.Notification = Notification;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Notification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Notification.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification title' }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Notification message' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.NotificationType, description: 'Notification type' }),
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.NotificationType }),
    __metadata("design:type", String)
], Notification.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.NotificationChannel, description: 'Delivery channel' }),
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.NotificationChannel }),
    __metadata("design:type", String)
], Notification.prototype, "channel", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.NotificationStatus, description: 'Notification status' }),
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.NotificationStatus, default: enums_1.NotificationStatus.PENDING }),
    __metadata("design:type", String)
], Notification.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Notification.prototype, "related_user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Scheduled delivery time' }),
    (0, typeorm_1.Column)({ default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Notification.prototype, "scheduled_for", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Actual delivery time', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "sent_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Delivery confirmation time', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "delivered_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Failure time', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "failed_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Error message', required: false }),
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], Notification.prototype, "error_message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temporal workflow ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "workflow_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Temporal workflow run ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], Notification.prototype, "workflow_run_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Read timestamp', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "read_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Click timestamp', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Notification.prototype, "clicked_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Notification.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.notifications),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, task => task.notifications, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_entity_1.Task)
], Notification.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'related_user_id' }),
    __metadata("design:type", user_entity_1.User)
], Notification.prototype, "related_user", void 0);
exports.Notification = Notification = __decorate([
    (0, typeorm_1.Entity)('notifications'),
    (0, typeorm_1.Index)(['user_id']),
    (0, typeorm_1.Index)(['status']),
    (0, typeorm_1.Index)(['scheduled_for']),
    (0, typeorm_1.Index)(['task_id']),
    (0, typeorm_1.Check)(`"scheduled_for" >= "created_at"`)
], Notification);
//# sourceMappingURL=notification.entity.js.map