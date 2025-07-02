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
exports.TaskAttachment = void 0;
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const user_entity_1 = require("../../users/entities/user.entity");
const task_entity_1 = require("./task.entity");
let TaskAttachment = class TaskAttachment {
    id;
    task_id;
    uploaded_by_id;
    filename;
    original_filename;
    file_size;
    mime_type;
    file_url;
    uploaded_at;
    task;
    uploaded_by;
    get file_size_mb() {
        return Math.round((this.file_size / 1024 / 1024) * 100) / 100;
    }
};
exports.TaskAttachment = TaskAttachment;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unique identifier' }),
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TaskAttachment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskAttachment.prototype, "task_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskAttachment.prototype, "uploaded_by_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Processed filename' }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], TaskAttachment.prototype, "filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Original filename' }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], TaskAttachment.prototype, "original_filename", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File size in bytes' }),
    (0, typeorm_1.Column)({ type: 'bigint' }),
    __metadata("design:type", Number)
], TaskAttachment.prototype, "file_size", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File MIME type' }),
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], TaskAttachment.prototype, "mime_type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'File URL' }),
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], TaskAttachment.prototype, "file_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Upload timestamp' }),
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskAttachment.prototype, "uploaded_at", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => task_entity_1.Task, task => task.attachments),
    (0, typeorm_1.JoinColumn)({ name: 'task_id' }),
    __metadata("design:type", task_entity_1.Task)
], TaskAttachment.prototype, "task", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'uploaded_by_id' }),
    __metadata("design:type", user_entity_1.User)
], TaskAttachment.prototype, "uploaded_by", void 0);
exports.TaskAttachment = TaskAttachment = __decorate([
    (0, typeorm_1.Entity)('task_attachments'),
    (0, typeorm_1.Check)(`"file_size" > 0`),
    (0, typeorm_1.Check)(`"file_size" <= 52428800`)
], TaskAttachment);
//# sourceMappingURL=task-attachment.entity.js.map