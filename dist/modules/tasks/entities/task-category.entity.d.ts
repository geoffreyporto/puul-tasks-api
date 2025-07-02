import { User } from '../../users/entities/user.entity';
import { Team } from '../../teams/entities/team.entity';
import { Task } from './task.entity';
export declare class TaskCategory {
    id: string;
    name: string;
    description?: string;
    color: string;
    team_id?: string;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    created_by?: string;
    team?: Team;
    createdByUser?: User;
    tasks: Task[];
}
