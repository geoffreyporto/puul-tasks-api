import { UserRole } from '../../../common/enums';
import { TaskAssignment } from '../../tasks/entities/task-assignment.entity';
import { Task } from '../../tasks/entities/task.entity';
import { Notification } from '../../notifications/entities/notification.entity';
import { ActivityLog } from '../../audit/entities/activity-log.entity';
import { UserSession } from './user-session.entity';
import { TeamMembership } from '../../teams/entities/team-membership.entity';
export declare class User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    password_hash?: string;
    avatar_url?: string;
    phone?: string;
    timezone: string;
    is_active: boolean;
    last_login_at?: Date;
    email_verified_at?: Date;
    created_at: Date;
    updated_at: Date;
    created_by?: User;
    updated_by?: User;
    task_assignments: TaskAssignment[];
    created_tasks: Task[];
    notifications: Notification[];
    activity_logs: ActivityLog[];
    sessions: UserSession[];
    team_memberships: TeamMembership[];
}
