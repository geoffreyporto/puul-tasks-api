import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from './config/database.config';

// Importar módulos
import { UsersModule } from './modules/users/users.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { Task } from './modules/tasks/entities/task.entity';
//import { TeamsModule } from './modules/teams/teams.module';
//import { NotificationsModule } from './modules/notifications/notifications.module';
//import { AuditModule } from './modules/audit/audit.module';
//import { AuthModule } from './modules/auth/auth.module';
import { TaskAssignment } from './modules/tasks/entities/task-assignment.entity';
import { TaskComment } from './modules/tasks/entities/task-comment.entity';
import { TaskAttachment } from './modules/tasks/entities/task-attachment.entity';
import { ActivityLog } from './modules/audit/entities/activity-log.entity';
import { UserSession } from './modules/users/entities/user-session.entity';
import { User } from './modules/users/entities/user.entity';
import { TaskCategory } from './modules/tasks/entities/task-category.entity';
import { Team } from './modules/teams/entities/team.entity';
import { TeamMembership } from './modules/teams/entities/team-membership.entity';

@Module({
  imports: [
    // Configuración global
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    // Base de datos
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return getDatabaseConfig(configService);
      },
    }),
    
    // Entidades
    TypeOrmModule.forFeature([
      User,
      UserSession,
      Team,
      TeamMembership,
      Task,
      TaskCategory,
      TaskAssignment,
      TaskComment,
      TaskAttachment,
      ActivityLog,
    ]),
    
    // Módulos
    UsersModule,
    TasksModule,
    //TeamsModule,
    //NotificationsModule,
    //AuditModule,
    //AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}