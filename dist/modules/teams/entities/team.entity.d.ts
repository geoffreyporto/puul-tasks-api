import { TaskCategory } from '../../tasks/entities/task-category.entity';
import { Task } from '../../tasks/entities/task.entity';
import { TeamMembership } from './team-membership.entity';
export declare class Team {
    id: string;
    name: string;
    slug: string;
    description: string;
    logoUrl: string;
    isActive: boolean;
    categories: TaskCategory[];
    tasks: Task[];
    memberships: TeamMembership[];
    createdAt: Date;
    updatedAt: Date;
}
