"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const user_entity_1 = require("./entities/user.entity");
const pagination_helper_1 = require("../../common/utils/pagination.helper");
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async create(createUserDto, createdBy) {
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('A user with this email already exists');
        }
        let password_hash;
        if (createUserDto.password) {
            password_hash = await bcrypt.hash(createUserDto.password, 12);
        }
        const userData = {
            ...createUserDto,
        };
        if (password_hash) {
            userData.password_hash = password_hash;
        }
        if (createdBy && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(createdBy)) {
            userData.created_by = createdBy;
        }
        const user = this.userRepository.create(userData);
        try {
            const savedUser = await this.userRepository.save(user);
            const { password_hash: _, ...userWithoutPassword } = savedUser;
            return userWithoutPassword;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('A user with this email already exists');
            }
            throw error;
        }
    }
    async findAll(filters) {
        const queryBuilder = this.createUserQueryBuilder();
        this.applyUserFilters(queryBuilder, filters);
        const total = await queryBuilder.getCount();
        queryBuilder
            .skip(filters.offset)
            .limit(filters.limit);
        const users = await queryBuilder.getRawMany();
        const usersWithStats = users.map(this.transformToUserWithStatsDto);
        return pagination_helper_1.PaginationHelper.createPaginatedResult(usersWithStats, total, filters.page, filters.limit);
    }
    async findOne(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['team_memberships', 'team_memberships.team'],
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with ID ${id} not found`);
        }
        delete user.password_hash;
        return user;
    }
    async findByEmail(email) {
        return await this.userRepository.findOne({
            where: { email },
            select: ['id', 'email', 'name', 'role', 'password_hash', 'is_active'],
        });
    }
    async findByIds(options) {
        const users = await this.userRepository.find({
            where: options.where,
            relations: ['team_memberships', 'team_memberships.team'],
        });
        return users.map(user => {
            delete user.password_hash;
            return user;
        });
    }
    async update(id, updateUserDto, updatedBy) {
        const user = await this.findOne(id);
        const updateData = { ...updateUserDto };
        if (updatedBy && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updatedBy)) {
            updateData.updated_by = updatedBy;
        }
        Object.assign(user, updateData, {
            updated_at: new Date(),
        });
        try {
            const updatedUser = await this.userRepository.save(user);
            delete updatedUser.password_hash;
            return updatedUser;
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('A user with this email already exists');
            }
            throw error;
        }
    }
    async updateLastLogin(id) {
        await this.userRepository.update(id, {
            last_login_at: new Date(),
        });
    }
    async changePassword(id, currentPassword, newPassword) {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'password_hash'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (!user.password_hash) {
            throw new common_1.BadRequestException('User does not have a password set');
        }
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const newPasswordHash = await bcrypt.hash(newPassword, 12);
        await this.userRepository.update(id, {
            password_hash: newPasswordHash,
            updated_at: new Date(),
        });
    }
    async deactivate(id) {
        const user = await this.findOne(id);
        await this.userRepository.update(id, {
            is_active: false,
            updated_at: new Date(),
        });
    }
    async remove(id) {
        const user = await this.findOne(id);
        await this.userRepository.remove(user);
    }
    createUserQueryBuilder() {
        return this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.task_assignments', 'ta', 'ta.is_active = :isActive', { isActive: true })
            .leftJoin('ta.task', 'task')
            .select([
            'user.id',
            'user.name',
            'user.email',
            'user.role',
            'user.avatar_url',
            'user.phone',
            'user.timezone',
            'user.is_active',
            'user.last_login_at',
            'user.created_at',
            'user.updated_at',
            'COUNT(CASE WHEN task.status = \'completed\' THEN 1 END) as completed_tasks',
            'COUNT(CASE WHEN task.status = \'active\' THEN 1 END) as active_tasks',
            'COUNT(CASE WHEN task.status = \'active\' AND task.due_date < NOW() THEN 1 END) as overdue_tasks',
            'COALESCE(SUM(CASE WHEN task.status = \'completed\' THEN task.cost ELSE 0 END), 0) as total_completed_value',
            'COUNT(ta.id) as total_task_assignments',
            `CASE 
          WHEN COUNT(ta.id) > 0 THEN
            ROUND(
              (COUNT(CASE WHEN task.status = 'completed' THEN 1 END) * 10) -
              (COUNT(CASE WHEN task.status = 'active' AND task.due_date < NOW() THEN 1 END) * 5) +
              (COALESCE(SUM(CASE WHEN task.status = 'completed' THEN task.cost ELSE 0 END), 0) / 100)
            , 0)
          ELSE 0 
        END as productivity_score`,
        ])
            .where('user.is_active = :isActive', { isActive: true })
            .groupBy('user.id, user.name, user.email, user.role, user.avatar_url, user.phone, user.timezone, user.is_active, user.last_login_at, user.created_at, user.updated_at');
    }
    applyUserFilters(queryBuilder, filters) {
        if (filters.name) {
            queryBuilder.andWhere('user.name ILIKE :name', { name: `%${filters.name}%` });
        }
        if (filters.email) {
            queryBuilder.andWhere('user.email ILIKE :email', { email: `%${filters.email}%` });
        }
        if (filters.role) {
            queryBuilder.andWhere('user.role = :role', { role: filters.role });
        }
    }
    transformToUserWithStatsDto(rawUser) {
        return {
            id: rawUser.user_id,
            name: rawUser.user_name,
            email: rawUser.user_email,
            role: rawUser.user_role,
            avatar_url: rawUser.user_avatar_url,
            phone: rawUser.user_phone,
            timezone: rawUser.user_timezone,
            is_active: rawUser.user_is_active,
            last_login_at: rawUser.user_last_login_at,
            created_at: rawUser.user_created_at,
            updated_at: rawUser.user_updated_at,
            completed_tasks: parseInt(rawUser.completed_tasks) || 0,
            active_tasks: parseInt(rawUser.active_tasks) || 0,
            overdue_tasks: parseInt(rawUser.overdue_tasks) || 0,
            total_completed_value: parseInt(rawUser.total_completed_value) || 0,
            total_assignments: parseInt(rawUser.total_task_assignments) || 0,
            productivity_score: parseInt(rawUser.productivity_score) || 0,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map