// src/modules/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { TaskAssignment } from './entities/task-assignment.entity';
import { TaskCategory } from './entities/task-category.entity';
import { TaskComment } from './entities/task-comment.entity';
import { TaskAttachment } from './entities/task-attachment.entity';
import { UsersModule } from '../users/users.module';
import { User } from '../users/entities/user.entity';
import { TaskAnalyticsController } from './analytics.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Task, 
      TaskAssignment, 
      TaskCategory,
      TaskComment,
      TaskAttachment,
      User, // Añadimos User para poder inyectar UserRepository en TasksService
    ]),
    UsersModule,
  ],
  controllers: [TasksController, TaskAnalyticsController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}

// Exportar los servicios para uso en otros módulos
export { UsersModule, TasksService };