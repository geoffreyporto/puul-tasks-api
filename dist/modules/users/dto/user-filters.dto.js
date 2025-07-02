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
exports.UserFiltersDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
const class_transformer_1 = require("class-transformer");
class UserFiltersDto {
    name;
    email;
    role;
    page = 1;
    limit = 10;
    get offset() {
        return (this.page - 1) * this.limit;
    }
}
exports.UserFiltersDto = UserFiltersDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by name', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserFiltersDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Filter by email', required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserFiltersDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.UserRole, description: 'Filter by role', required: false }),
    (0, class_validator_1.IsEnum)(enums_1.UserRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UserFiltersDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Page number', default: 1 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Object)
], UserFiltersDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Items per page', default: 10 }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => parseInt(value, 10)),
    __metadata("design:type", Object)
], UserFiltersDto.prototype, "limit", void 0);
//# sourceMappingURL=user-filters.dto.js.map