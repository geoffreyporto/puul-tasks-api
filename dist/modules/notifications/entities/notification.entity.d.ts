import { NotificationType, NotificationStatus, NotificationChannel } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Task } from '../../tasks/entities/task.entity';
export declare class Notification {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: NotificationType;
    channel: NotificationChannel;
    status: NotificationStatus;
    task_id?: string;
    related_user_id?: string;
    scheduled_for: Date;
    sent_at?: Date;
    delivered_at?: Date;
    failed_at?: Date;
    error_message?: string;
    workflow_id?: string;
    workflow_run_id?: string;
    read_at?: Date;
    clicked_at?: Date;
    created_at: Date;
    user: User;
    task?: Task;
    related_user?: User;
    get is_read(): boolean;
    get is_urgent(): boolean;
}
