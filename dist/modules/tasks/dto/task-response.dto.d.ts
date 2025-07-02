export declare class TaskResponseDto {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: number;
    dueDate: string;
    cost: number;
    estimated_hours: number;
    actual_hours: number;
    created_at: string;
    updated_at: string;
    completedAt?: string;
    categoryId?: string;
    category?: {
        id: string;
        name: string;
        color: string;
    };
    parent_task_id?: string;
    started_at?: string;
    completed_at?: string;
    created_by_name?: string;
    assignedUserIds: string[];
    assignees: any[];
    teamId?: string;
    teamName?: string;
    team?: {
        id: string;
        name: string;
        slug: string;
    };
    is_overdue: boolean;
    is_due_soon: boolean;
    comments_count: number;
    attachments_count: number;
    assignee_count: number;
    completion_percentage: number;
}
