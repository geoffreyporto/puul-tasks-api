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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
const task_assignment_entity_1 = require("../../tasks/entities/task-assignment.entity");
const task_entity_1 = require("../../tasks/entities/task.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
const activity_log_entity_1 = require("../../audit/entities/activity-log.entity");
const user_session_entity_1 = require("./user-session.entity");
const team_membership_entity_1 = require("../../teams/entities/team-membership.entity");
let User = class User {
    id;
    email;
    name;
    role;
    password_hash;
    avatar_url;
    phone;
    timezone;
    is_active;
    last_login_at;
    email_verified_at;
    created_at;
    updated_at;
    created_by;
    updated_by;
    task_assignments;
    created_tasks;
    notifications;
    activity_logs;
    sessions;
    team_memberships;
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User email address' }),
    (0, typeorm_1.Column)({ unique: true, length: 255 }),
    (0, typeorm_1.Index)(),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User full name' }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.UserRole, description: 'User role in the system' }),
    (0, typeorm_1.Column)({ type: 'enum', enum: enums_1.UserRole, default: enums_1.UserRole.MEMBER }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, class_transformer_1.Exclude)(),
    (0, typeorm_1.Column)({ nullable: true, length: 255 }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User avatar URL', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User phone number', required: false }),
    (0, typeorm_1.Column)({ nullable: true, length: 20 }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User timezone' }),
    (0, typeorm_1.Column)({ default: 'UTC', length: 50 }),
    __metadata("design:type", String)
], User.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether user is active' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last login timestamp', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "last_login_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email verification timestamp', required: false }),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "email_verified_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", User)
], User.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", User)
], User.prototype, "updated_by", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_assignment_entity_1.TaskAssignment, assignment => assignment.user),
    __metadata("design:type", Array)
], User.prototype, "task_assignments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, task => task.created_by),
    __metadata("design:type", Array)
], User.prototype, "created_tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, notification => notification.user),
    __metadata("design:type", Array)
], User.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => activity_log_entity_1.ActivityLog, log => log.user),
    __metadata("design:type", Array)
], User.prototype, "activity_logs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_session_entity_1.UserSession, session => session.user),
    __metadata("design:type", Array)
], User.prototype, "sessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => team_membership_entity_1.TeamMembership, membership => membership.user),
    __metadata("design:type", Array)
], User.prototype, "team_memberships", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users'),
    (0, typeorm_1.Index)(['email']),
    (0, typeorm_1.Index)(['role']),
    (0, typeorm_1.Index)(['is_active'])
], User);
//# sourceMappingURL=user.entity.js.map