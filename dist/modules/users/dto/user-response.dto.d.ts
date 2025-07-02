export declare class UserWithStatsDto {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar_url?: string;
    phone?: string;
    timezone?: string;
    is_active: boolean;
    last_login_at?: Date;
    created_at: Date;
    updated_at?: Date;
    completed_tasks: number;
    active_tasks: number;
    overdue_tasks: number;
    total_completed_value: number;
    total_assignments: number;
    productivity_score: number;
}
