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
exports.UserWithStatsDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class UserWithStatsDto {
    id;
    name;
    email;
    role;
    avatar_url;
    phone;
    timezone;
    is_active;
    last_login_at;
    created_at;
    updated_at;
    completed_tasks;
    active_tasks;
    overdue_tasks;
    total_completed_value;
    total_assignments;
    productivity_score;
}
exports.UserWithStatsDto = UserWithStatsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User ID' }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Full name' }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address' }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User role' }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'URL to user avatar', required: false }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "avatar_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Phone number', required: false }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'User timezone', required: false }),
    __metadata("design:type", String)
], UserWithStatsDto.prototype, "timezone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Active status' }),
    __metadata("design:type", Boolean)
], UserWithStatsDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last login timestamp', required: false }),
    __metadata("design:type", Date)
], UserWithStatsDto.prototype, "last_login_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Created timestamp' }),
    __metadata("design:type", Date)
], UserWithStatsDto.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Updated timestamp', required: false }),
    __metadata("design:type", Date)
], UserWithStatsDto.prototype, "updated_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of completed tasks' }),
    __metadata("design:type", Number)
], UserWithStatsDto.prototype, "completed_tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of active tasks' }),
    __metadata("design:type", Number)
], UserWithStatsDto.prototype, "active_tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of overdue tasks' }),
    __metadata("design:type", Number)
], UserWithStatsDto.prototype, "overdue_tasks", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total value of completed tasks' }),
    __metadata("design:type", Number)
], UserWithStatsDto.prototype, "total_completed_value", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Total task assignments' }),
    __metadata("design:type", Number)
], UserWithStatsDto.prototype, "total_assignments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Productivity score' }),
    __metadata("design:type", Number)
], UserWithStatsDto.prototype, "productivity_score", void 0);
//# sourceMappingURL=user-response.dto.js.map