import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';
export declare class TaskAssignment {
    id: string;
    task_id: string;
    user_id: string;
    assigned_at: Date;
    assigned_by: string;
    is_primary: boolean;
    hours_allocated?: number;
    notes?: string;
    accepted_at?: Date;
    completed_at?: Date;
    is_active: boolean;
    task: Task;
    user: User;
    assignedByUser: User;
}
