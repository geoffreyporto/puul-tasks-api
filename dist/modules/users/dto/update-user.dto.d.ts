import { UserRole } from '../../../common/enums';
export declare class UpdateUserDto {
    name?: string;
    email?: string;
    role?: UserRole;
    avatarUrl?: string;
    phone?: string;
    timezone?: string;
    isActive?: boolean;
}
