import { User } from '../../users/entities/user.entity';
export declare class ActivityLog {
    id: string;
    user_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    old_values?: Record<string, any>;
    new_values?: Record<string, any>;
    changes?: Record<string, any>;
    ip_address?: string;
    user_agent?: string;
    session_id?: string;
    occurred_at: Date;
    user?: User;
}
