"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksService = exports.UsersModule = exports.TasksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tasks_service_1 = require("./tasks.service");
Object.defineProperty(exports, "TasksService", { enumerable: true, get: function () { return tasks_service_1.TasksService; } });
const tasks_controller_1 = require("./tasks.controller");
const task_entity_1 = require("./entities/task.entity");
const task_assignment_entity_1 = require("./entities/task-assignment.entity");
const task_category_entity_1 = require("./entities/task-category.entity");
const task_comment_entity_1 = require("./entities/task-comment.entity");
const task_attachment_entity_1 = require("./entities/task-attachment.entity");
const users_module_1 = require("../users/users.module");
Object.defineProperty(exports, "UsersModule", { enumerable: true, get: function () { return users_module_1.UsersModule; } });
const user_entity_1 = require("../users/entities/user.entity");
const analytics_controller_1 = require("./analytics.controller");
let TasksModule = class TasksModule {
};
exports.TasksModule = TasksModule;
exports.TasksModule = TasksModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                task_entity_1.Task,
                task_assignment_entity_1.TaskAssignment,
                task_category_entity_1.TaskCategory,
                task_comment_entity_1.TaskComment,
                task_attachment_entity_1.TaskAttachment,
                user_entity_1.User,
            ]),
            users_module_1.UsersModule,
        ],
        controllers: [tasks_controller_1.TasksController, analytics_controller_1.TaskAnalyticsController],
        providers: [tasks_service_1.TasksService],
        exports: [tasks_service_1.TasksService],
    })
], TasksModule);
//# sourceMappingURL=tasks.module.js.map