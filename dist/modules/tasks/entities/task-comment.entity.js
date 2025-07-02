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
exports.TaskComment = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const task_entity_1 = require("./task.entity");
let TaskComment = class TaskComment {
    id;
    task_id;
    user_id;
    content;
    is_internal;
    parent_comment_id;
    created_at;
    updated_at;
    task;
    user;
    parent_comment;
    replies;
};
exports.TaskComment = TaskComment;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskComment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskComment.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskComment.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Comment content' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TaskComment.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Whether comment is internal' }),
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], TaskComment.prototype, "is_internal", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], TaskComment.prototype, "parent_comment_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Creation timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskComment.prototype, "created_at", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Last update timestamp' }),
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TaskComment.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, task => task.comments),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_entity_1.Task)
], TaskComment.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], TaskComment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TaskComment, comment => comment.replies, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'parent_comment_id' }),
    __metadata("design:type", TaskComment)
], TaskComment.prototype, "parent_comment", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TaskComment, comment => comment.parent_comment),
    __metadata("design:type", Array)
], TaskComment.prototype, "replies", void 0);
exports.TaskComment = TaskComment = __decorate([
    (0, typeorm_1.Entity)('task_comments'),
    (0, typeorm_1.Check)(`LENGTH("content") >= 1 AND LENGTH("content") <= 5000`)
], TaskComment);
//# sourceMappingURL=task-comment.entity.js.map