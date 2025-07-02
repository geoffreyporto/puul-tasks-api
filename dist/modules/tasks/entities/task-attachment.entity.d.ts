import { User } from '../../users/entities/user.entity';
import { Task } from './task.entity';
export declare class TaskAttachment {
    id: string;
    task_id: string;
    uploaded_by_id: string;
    filename: string;
    original_filename: string;
    file_size: number;
    mime_type: string;
    file_url: string;
    uploaded_at: Date;
    task: Task;
    uploaded_by: User;
    get file_size_mb(): number;
}
