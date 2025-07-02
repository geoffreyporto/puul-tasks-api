import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';
export declare class TaskComment {
    id: string;
    task_id: string;
    user_id: string;
    content: string;
    is_internal: boolean;
    parent_comment_id?: string;
    created_at: Date;
    updated_at: Date;
    task: Task;
    user: User;
    parent_comment?: TaskComment;
    replies: TaskComment[];
}
