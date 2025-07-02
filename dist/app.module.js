"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const database_config_1 = require("./config/database.config");
const users_module_1 = require("./modules/users/users.module");
const tasks_module_1 = require("./modules/tasks/tasks.module");
const task_entity_1 = require("./modules/tasks/entities/task.entity");
const task_assignment_entity_1 = require("./modules/tasks/entities/task-assignment.entity");
const task_comment_entity_1 = require("./modules/tasks/entities/task-comment.entity");
const task_attachment_entity_1 = require("./modules/tasks/entities/task-attachment.entity");
const activity_log_entity_1 = require("./modules/audit/entities/activity-log.entity");
const user_session_entity_1 = require("./modules/users/entities/user-session.entity");
const user_entity_1 = require("./modules/users/entities/user.entity");
const task_category_entity_1 = require("./modules/tasks/entities/task-category.entity");
const team_entity_1 = require("./modules/teams/entities/team.entity");
const team_membership_entity_1 = require("./modules/teams/entities/team-membership.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env.local', '.env'],
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => {
                    return (0, database_config_1.getDatabaseConfig)(configService);
                },
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                user_session_entity_1.UserSession,
                team_entity_1.Team,
                team_membership_entity_1.TeamMembership,
                task_entity_1.Task,
                task_category_entity_1.TaskCategory,
                task_assignment_entity_1.TaskAssignment,
                task_comment_entity_1.TaskComment,
                task_attachment_entity_1.TaskAttachment,
                activity_log_entity_1.ActivityLog,
            ]),
            users_module_1.UsersModule,
            tasks_module_1.TasksModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map