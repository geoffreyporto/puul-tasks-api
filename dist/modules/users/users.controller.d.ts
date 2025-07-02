import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserWithStatsDto } from './dto/user-response.dto';
import { User } from './entities/user.entity';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createUserDto: CreateUserDto): Promise<User>;
    findAll(filters: UserFiltersDto): Promise<PaginatedResult<UserWithStatsDto>>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
}
