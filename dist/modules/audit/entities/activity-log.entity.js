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
exports.ActivityLog = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
let ActivityLog = class ActivityLog {
    id;
    user_id;
    action;
    resource_type;
    resource_id;
    old_values;
    new_values;
    changes;
    ip_address;
    user_agent;
    session_id;
    occurred_at;
    user;
};
exports.ActivityLog = ActivityLog;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], ActivityLog.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Action performed' }),
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource type affected' }),
    (0, typeorm_1.Column)({ length: 50 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "resource_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Resource ID affected', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "resource_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Previous values', required: false }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "old_values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'New values', required: false }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "new_values", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Changed fields only', required: false }),
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], ActivityLog.prototype, "changes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Client IP address', required: false }),
    (0, typeorm_1.Column)({ type: 'inet', nullable: true }),
    __metadata("design:type", String)
], ActivityLog.prototype, "ip_address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User agent', required: false }),
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], ActivityLog.prototype, "user_agent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Session ID', required: false }),
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], ActivityLog.prototype, "session_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'When action occurred' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], ActivityLog.prototype, "occurred_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.activity_logs, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], ActivityLog.prototype, "user", void 0);
exports.ActivityLog = ActivityLog = __decorate([
    (0, typeorm_1.Entity)('activity_logs'),
    (0, typeorm_1.Index)(['user_id', 'occurred_at']),
    (0, typeorm_1.Index)(['resource_type', 'resource_id']),
    (0, typeorm_1.Index)(['occurred_at'])
], ActivityLog);
//# sourceMappingURL=activity-log.entity.js.map