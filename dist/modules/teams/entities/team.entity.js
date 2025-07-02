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
exports.Team = void 0;
const typeorm_1 = require("typeorm");
const task_category_entity_1 = require("../../tasks/entities/task-category.entity");
const task_entity_1 = require("../../tasks/entities/task.entity");
const team_membership_entity_1 = require("./team-membership.entity");
let Team = class Team {
    id;
    name;
    slug;
    description;
    logoUrl;
    isActive;
    categories;
    tasks;
    memberships;
    createdAt;
    updatedAt;
};
exports.Team = Team;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Team.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Team.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Team.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Team.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, name: 'logo_url' }),
    __metadata("design:type", String)
], Team.prototype, "logoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true, name: 'is_active' }),
    __metadata("design:type", Boolean)
], Team.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_category_entity_1.TaskCategory, category => category.team),
    __metadata("design:type", Array)
], Team.prototype, "categories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => task_entity_1.Task, task => task.team),
    __metadata("design:type", Array)
], Team.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => team_membership_entity_1.TeamMembership, membership => membership.team),
    __metadata("design:type", Array)
], Team.prototype, "memberships", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp', name: 'created_at' }),
    __metadata("design:type", Date)
], Team.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ type: 'timestamp', name: 'updated_at' }),
    __metadata("design:type", Date)
], Team.prototype, "updatedAt", void 0);
exports.Team = Team = __decorate([
    (0, typeorm_1.Entity)('teams')
], Team);
//# sourceMappingURL=team.entity.js.map