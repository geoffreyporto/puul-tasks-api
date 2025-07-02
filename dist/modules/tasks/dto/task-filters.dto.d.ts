export declare class TaskFiltersDto {
    title?: string;
    status?: string;
    priority?: number;
    assignedUserId?: string;
    categoryId?: string;
    teamId?: string;
    dueDate?: string;
    assignedUser?: string;
    sort?: string;
    page: number;
    limit: number;
    get offset(): number;
}
