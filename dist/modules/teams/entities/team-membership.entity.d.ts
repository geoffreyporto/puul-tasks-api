import { User } from '../../users/entities/user.entity';
import { Team } from './team.entity';
export declare class TeamMembership {
    id: string;
    teamId: string;
    userId: string;
    role: string;
    isActive: boolean;
    team: Team;
    user: User;
    createdAt: Date;
    updatedAt: Date;
}
