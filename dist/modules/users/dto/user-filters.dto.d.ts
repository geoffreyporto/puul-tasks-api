import { UserRole } from '../../../common/enums';
export declare class UserFiltersDto {
    name?: string;
    email?: string;
    role?: UserRole;
    page: number;
    limit: number;
    get offset(): number;
}
