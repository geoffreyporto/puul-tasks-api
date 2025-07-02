import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserWithStatsDto } from './dto/user-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createUserDto: CreateUserDto, createdBy?: string | null): Promise<User>;
    findAll(filters: UserFiltersDto): Promise<PaginatedResult<UserWithStatsDto>>;
    findOne(id: string): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findByIds(options: {
        where: any;
    }): Promise<User[]>;
    update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string | null): Promise<User>;
    updateLastLogin(id: string): Promise<void>;
    changePassword(id: string, currentPassword: string, newPassword: string): Promise<void>;
    deactivate(id: string): Promise<void>;
    remove(id: string): Promise<void>;
    private createUserQueryBuilder;
    private applyUserFilters;
    private transformToUserWithStatsDto;
}
