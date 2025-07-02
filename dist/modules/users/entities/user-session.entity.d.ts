import { User } from './user.entity';
export declare class UserSession {
    id: string;
    user_id: string;
    session_token: string;
    refresh_token?: string;
    ip_address?: string;
    user_agent?: string;
    device_info?: Record<string, any>;
    created_at: Date;
    last_activity_at: Date;
    expires_at: Date;
    is_active: boolean;
    revoked_at?: Date;
    revoked_by_id?: string;
    user: User;
    revoked_by?: User;
    get is_expired(): boolean;
    get is_valid(): boolean;
}
