/**
 * =====================================================
 * SERVICIO DE USUARIOS
 * =====================================================
 */

// src/modules/users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserFiltersDto } from './dto/user-filters.dto';
import { UserWithStatsDto } from './dto/user-response.dto';
import { PaginatedResult } from '../../common/interfaces/paginated-result.interface';
import { PaginationHelper } from '../../common/utils/pagination.helper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto, createdBy?: string | null): Promise<User> {
    // Verificar si el email ya existe
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('A user with this email already exists');
    }

    // Hash de la contraseña si se proporciona
    let password_hash: string | undefined;
    if (createUserDto.password) {
      password_hash = await bcrypt.hash(createUserDto.password, 12);
    }

    // Crear usuario
    const userData: Partial<User> = {
      ...createUserDto,
    };
    
    // Asignar propiedades que no están en el DTO pero sí en la entidad
    if (password_hash) {
      (userData as any).password_hash = password_hash;
    }
    
    // Solo asignar created_by si es un UUID válido
    if (createdBy && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(createdBy)) {
      (userData as any).created_by = createdBy;
    }
    
    const user = this.userRepository.create(userData);

    try {
      const savedUser = await this.userRepository.save(user);
      // No devolver el hash de contraseña
      const { password_hash: _, ...userWithoutPassword } = savedUser as any;
      return userWithoutPassword;
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async findAll(filters: UserFiltersDto): Promise<PaginatedResult<UserWithStatsDto>> {
    const queryBuilder = this.createUserQueryBuilder();
    
    // Aplicar filtros
    this.applyUserFilters(queryBuilder, filters);

    // Obtener total para paginación
    const total = await queryBuilder.getCount();

    // Aplicar paginación
    queryBuilder
      .skip(filters.offset)
      .limit(filters.limit);

    // Obtener resultados
    const users = await queryBuilder.getRawMany();

    // Transformar a DTO
    const usersWithStats = users.map(this.transformToUserWithStatsDto);

    return PaginationHelper.createPaginatedResult(
      usersWithStats,
      total,
      filters.page,
      filters.limit,
    );
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['team_memberships', 'team_memberships.team'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    delete user.password_hash;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'name', 'role', 'password_hash', 'is_active'],
    });
  }

  async findByIds(options: { where: any }): Promise<User[]> {
    const users = await this.userRepository.find({
      where: options.where,
      relations: ['team_memberships', 'team_memberships.team'],
    });
    return users.map(user => {
      delete user.password_hash;
      return user;
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto, updatedBy?: string | null): Promise<User> {
    const user = await this.findOne(id);

    // Preparar datos para actualización
    const updateData: any = { ...updateUserDto };
    
    // Solo asignar updated_by si es un UUID válido
    if (updatedBy && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(updatedBy)) {
      updateData.updated_by = updatedBy;
    }
    
    // Actualizar campos
    Object.assign(user, updateData, {
      updated_at: new Date(),
    });

    try {
      const updatedUser = await this.userRepository.save(user);
      delete updatedUser.password_hash;
      return updatedUser;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('A user with this email already exists');
      }
      throw error;
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {
      last_login_at: new Date(),
    });
  }

  async changePassword(id: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'password_hash'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.password_hash) {
      throw new BadRequestException('User does not have a password set');
    }

    // Verificar contraseña actual
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Hash nueva contraseña
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await this.userRepository.update(id, {
      password_hash: newPasswordHash,
      updated_at: new Date(),
    });
  }

  async deactivate(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.update(id, {
      is_active: false,
      updated_at: new Date(),
    });
  }

  /**
   * Elimina un usuario de la base de datos (borrado físico)
   * @param id ID del usuario a eliminar
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  // Métodos privados de ayuda
  private createUserQueryBuilder(): SelectQueryBuilder<User> {
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
        // Cálculo del score de productividad
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

  private applyUserFilters(queryBuilder: SelectQueryBuilder<User>, filters: UserFiltersDto): void {
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

  private transformToUserWithStatsDto(rawUser: any): UserWithStatsDto {
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
}