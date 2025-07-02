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
exports.TaskCategory = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const team_entity_1 = require("../../teams/entities/team.entity");
const task_entity_1 = require("./task.entity");
let TaskCategory = class TaskCategory {
    id;
    name;
    description;
    color;
    team_id;
    is_active;
    created_at;
    updated_at;
    created_by;
    team;
    createdByUser;
    tasks;
};
exports.TaskCategory = TaskCategory;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskCategory.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category name' }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], TaskCategory.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category description', required: false }),
    (0, typeorm_1.Column)({ nullable: true, type: 'text' }),
    __metadata("design:type", String)
], TaskCategory.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Category color in hex format' }),
    (0, typeorm_1.Column)({ default: '#3B82F6', length: 7 }),
    __metadata("design:type", String)
], TaskCategory.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TaskCategory.prototype, "team_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether category is active' }),
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], TaskCategory.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskCategory.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TaskCategory.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TaskCategory.prototype, "created_by", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => team_entity_1.Team, team => team.categories, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'team_id' }),
    __metadata("design:type", team_entity_1.Team)
], TaskCategory.prototype, "team", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], TaskCategory.prototype, "createdByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, task => task.category),
    __metadata("design:type", Array)
], TaskCategory.prototype, "tasks", void 0);
exports.TaskCategory = TaskCategory = __decorate([
    (0, typeorm_1.Entity)('task_categories')
], TaskCategory);
//# sourceMappingURL=task-category.entity.js.map