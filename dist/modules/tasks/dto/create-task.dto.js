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
exports.CreateTaskDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTaskDto {
    title;
    description;
    estimatedHours;
    cost;
    dueDate;
    assignedUserIds;
}
exports.CreateTaskDto = CreateTaskDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Implementar API de usuarios' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Desarrollar endpoints CRUD para gestión de usuarios' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 8.5 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.1),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "estimatedHours", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.00 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTaskDto.prototype, "cost", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-07-15T23:59:59.000Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTaskDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['uuid-user-1', 'uuid-user-2'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)(4, { each: true }),
    __metadata("design:type", Array)
], CreateTaskDto.prototype, "assignedUserIds", void 0);
//# sourceMappingURL=create-task.dto.js.map