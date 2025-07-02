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
exports.TaskStatusDistributionResponseDto = exports.TaskStatusDistributionQueryDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class TaskStatusDistributionQueryDto {
    start_date;
    end_date;
}
exports.TaskStatusDistributionQueryDto = TaskStatusDistributionQueryDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Start date filter in YYYY-MM-DD format', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TaskStatusDistributionQueryDto.prototype, "start_date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'End date filter in YYYY-MM-DD format', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], TaskStatusDistributionQueryDto.prototype, "end_date", void 0);
class TaskStatusDistributionResponseDto {
    not_started;
    in_progress;
    completed;
}
exports.TaskStatusDistributionResponseDto = TaskStatusDistributionResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of tasks not started yet' }),
    __metadata("design:type", Number)
], TaskStatusDistributionResponseDto.prototype, "not_started", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of tasks in progress' }),
    __metadata("design:type", Number)
], TaskStatusDistributionResponseDto.prototype, "in_progress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Number of tasks completed' }),
    __metadata("design:type", Number)
], TaskStatusDistributionResponseDto.prototype, "completed", void 0);
//# sourceMappingURL=task-status-distribution.dto.js.map