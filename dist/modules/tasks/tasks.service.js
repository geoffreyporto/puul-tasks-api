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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const task_entity_1 = require("./entities/task.entity");
const task_assignment_entity_1 = require("./entities/task-assignment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const pagination_helper_1 = require("../../common/utils/pagination.helper");
const enums_1 = require("../../common/enums");
const users_service_1 = require("../users/users.service");
let TasksService = class TasksService {
    taskRepository;
    taskAssignmentRepository;
    userRepository;
    usersService;
    constructor(taskRepository, taskAssignmentRepository, userRepository, usersService) {
        this.taskRepository = taskRepository;
        this.taskAssignmentRepository = taskAssignmentRepository;
        this.userRepository = userRepository;
        this.usersService = usersService;
    }
    async create(createTaskDto, createdBy) {
        let validCreatorId = null;
        if (createdBy === 'user-id-from-auth' || !this.isValidUUID(createdBy)) {
            const anyUser = await this.userRepository.findOne({
                where: { is_active: true },
                order: { created_at: 'DESC' }
            });
            if (anyUser) {
                validCreatorId = anyUser.id;
                console.log('Using existing user as creator:', validCreatorId);
            }
            else {
                throw new common_1.BadRequestException('No valid users found to assign as creator');
            }
        }
        else {
            const userExists = await this.userRepository.findOne({
                where: { id: createdBy }
            });
            if (userExists) {
                validCreatorId = createdBy;
            }
            else {
                const anyUser = await this.userRepository.findOne({
                    where: { is_active: true },
                    order: { created_at: 'DESC' }
                });
                if (anyUser) {
                    validCreatorId = anyUser.id;
                    console.log('Using existing user as creator because provided ID does not exist:', validCreatorId);
                }
                else {
                    throw new common_1.BadRequestException('No valid users found to assign as creator');
                }
            }
        }
        const { assignedUserIds, ...taskData } = createTaskDto;
        const taskToCreate = {
            ...taskData,
            estimated_hours: createTaskDto.estimatedHours || 1,
            due_date: createTaskDto.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        };
        if (validCreatorId) {
            taskToCreate.created_by = validCreatorId;
        }
        else {
            throw new common_1.BadRequestException('Cannot create task without a valid creator');
        }
        console.log('Task to create:', JSON.stringify(taskToCreate, null, 2));
        const task = this.taskRepository.create(taskToCreate);
        const savedTask = await this.taskRepository.save(task);
        if (assignedUserIds?.length > 0) {
            await this.assignTaskToUser({
                taskId: savedTask.id,
                userId: assignedUserIds[0],
                assignedBy: validCreatorId,
            }, validCreatorId);
        }
        return await this.findOne(savedTask.id);
    }
    async findAll(filters, userId) {
        const queryBuilder = this.createTaskQueryBuilder();
        this.applyTaskFilters(queryBuilder, filters);
        if (filters.sort) {
            this.applySorting(queryBuilder, filters.sort);
        }
        else {
            queryBuilder.orderBy('task.created_at', 'DESC');
        }
        const total = await queryBuilder.getCount();
        queryBuilder
            .skip(filters.offset)
            .limit(filters.limit);
        const tasks = await queryBuilder.getMany();
        const taskDtos = await Promise.all(tasks.map(task => this.mapTaskToResponseDto(task)));
        return pagination_helper_1.PaginationHelper.createPaginatedResult(taskDtos, total, filters.page, filters.limit);
    }
    async findOne(id) {
        const task = await this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.category', 'category')
            .leftJoinAndSelect('task.team', 'team')
            .leftJoinAndSelect('task.created_by', 'creator')
            .leftJoinAndSelect('task.assignments', 'assignment', 'assignment.is_active = :isActive', { isActive: true })
            .leftJoinAndSelect('assignment.user', 'assignee')
            .where('task.id = :id', { id })
            .getOne();
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return await this.mapTaskToResponseDto(task);
    }
    async update(id, updateTaskDto, updatedBy) {
        const task = await this.findTaskById(id);
        if (updateTaskDto.dueDate) {
            const dueDate = new Date(updateTaskDto.dueDate);
            if (isNaN(dueDate.getTime())) {
                throw new common_1.BadRequestException('Invalid due date format');
            }
            updateTaskDto.dueDate = dueDate.toISOString();
        }
        if (updateTaskDto.status === enums_1.TaskStatus.COMPLETED) {
            if (!updateTaskDto.completedAt) {
                updateTaskDto.completedAt = new Date().toISOString();
            }
            task.completion_percentage = 100;
            if (!task.actual_hours || task.actual_hours === 0) {
                task.actual_hours = task.estimated_hours || 1;
            }
            if (!task.started_at) {
                task.started_at = new Date();
            }
        }
        Object.assign(task, updateTaskDto, {
            updated_by_id: updatedBy,
        });
        await this.taskRepository.save(task);
        return await this.findOne(id);
    }
    async remove(id) {
        const task = await this.findTaskById(id);
        await this.taskRepository.remove(task);
    }
    async assignTaskToUser(createAssignmentDto, createdBy) {
        const { taskId, userId } = createAssignmentDto;
        const task = await this.taskRepository.findOne({
            where: { id: taskId },
        });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${taskId} not found`);
        }
        const user = await this.usersService.findOne(userId);
        const existingAssignment = await this.taskAssignmentRepository.findOne({
            where: { task_id: taskId, user_id: userId, is_active: true },
        });
        if (existingAssignment) {
            throw new common_1.ConflictException('User is already assigned to this task');
        }
        const assignment = this.taskAssignmentRepository.create({
            task_id: createAssignmentDto.taskId,
            user_id: createAssignmentDto.userId,
            assigned_by: createdBy,
        });
        return await this.taskAssignmentRepository.save(assignment);
    }
    async unassignUser(taskId, userId) {
        const assignment = await this.taskAssignmentRepository.findOne({
            where: { task_id: taskId, user_id: userId, is_active: true },
        });
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        assignment.is_active = false;
        await this.taskAssignmentRepository.save(assignment);
    }
    async getTaskStatusDistribution(startDate, endDate) {
        const queryBuilder = this.taskRepository.createQueryBuilder('task');
        if (startDate) {
            queryBuilder.andWhere('task.created_at >= :startDate', {
                startDate: new Date(startDate)
            });
        }
        if (endDate) {
            queryBuilder.andWhere('task.created_at <= :endDate', {
                endDate: new Date(`${endDate}T23:59:59.999Z`)
            });
        }
        const tasks = await queryBuilder.getMany();
        const distribution = {
            not_started: 0,
            in_progress: 0,
            completed: 0
        };
        for (const task of tasks) {
            if (task.status === enums_1.TaskStatus.COMPLETED) {
                distribution.completed++;
            }
            else if (task.started_at) {
                distribution.in_progress++;
            }
            else {
                distribution.not_started++;
            }
        }
        return distribution;
    }
    async getAnalytics(teamId) {
        const overviewQuery = this.taskRepository
            .createQueryBuilder('task')
            .select([
            'COUNT(*) as total_tasks',
            'COUNT(CASE WHEN task.status = \'completed\' THEN 1 END) as completed_tasks',
            'COUNT(CASE WHEN task.status = \'active\' THEN 1 END) as active_tasks',
            'COUNT(CASE WHEN task.status = \'active\' AND task.due_date < NOW() THEN 1 END) as overdue_tasks',
            'COUNT(CASE WHEN task.status = \'active\' AND task.due_date <= (NOW() + INTERVAL \'3 days\') THEN 1 END) as due_soon_tasks',
            'COALESCE(SUM(task.cost), 0) as total_cost',
            'COALESCE(SUM(CASE WHEN task.status = \'completed\' THEN task.cost ELSE 0 END), 0) as completed_value',
            'COALESCE(SUM(CASE WHEN task.status = \'active\' THEN task.cost ELSE 0 END), 0) as pending_value',
            'COALESCE(AVG(task.estimatedHours), 0) as avg_estimated_hours',
            'COALESCE(AVG(CASE WHEN task.status = \'completed\' THEN task.actual_hours END), 0) as avg_actual_hours',
        ]);
        if (teamId) {
            overviewQuery.where('task.team_id = :teamId', { teamId });
        }
        const overview = await overviewQuery.getRawOne();
        const userProductivityQuery = this.userRepository
            .createQueryBuilder('user')
            .leftJoin('user.task_assignments', 'ta', 'ta.is_active = :isActive', { isActive: true })
            .leftJoin('ta.task', 'task')
            .select([
            'user.id as user_id',
            'user.name as user_name',
            'user.email as user_email',
            'user.role',
            'COUNT(CASE WHEN task.status = \'completed\' THEN 1 END) as completed_tasks',
            'COUNT(CASE WHEN task.status = \'active\' THEN 1 END) as active_tasks',
            'COUNT(CASE WHEN task.status = \'active\' AND task.due_date < NOW() THEN 1 END) as overdue_tasks',
            'COALESCE(SUM(CASE WHEN task.status = \'completed\' THEN task.cost ELSE 0 END), 0) as total_revenue',
            'COALESCE(SUM(CASE WHEN task.status = \'active\' THEN task.cost ELSE 0 END), 0) as pending_value',
            'COALESCE(AVG(CASE WHEN task.status = \'completed\' THEN task.actual_hours END), 0) as avg_hours_per_task',
            'COALESCE(SUM(CASE WHEN task.status = \'completed\' THEN task.actual_hours ELSE 0 END), 0) as total_hours_worked',
            'COUNT(ta.id) as total_assignments',
        ])
            .where('user.is_active = :isActive', { isActive: true })
            .groupBy('user.id, user.name, user.email, user.role')
            .having('COUNT(ta.id) > 0')
            .orderBy('total_revenue', 'DESC');
        if (teamId) {
            userProductivityQuery.andWhere('task.team_id = :teamId', { teamId });
        }
        const userProductivity = await userProductivityQuery.getRawMany();
        const weeklyTrendsQuery = this.taskRepository
            .createQueryBuilder('task')
            .select([
            'DATE_TRUNC(\'week\', task.created_at) as week',
            'COUNT(*) as tasks_created',
            'COUNT(CASE WHEN task.status = \'completed\' THEN 1 END) as tasks_completed',
            'COUNT(CASE WHEN task.status = \'active\' THEN 1 END) as tasks_active',
            'ROUND(AVG(task.cost), 2) as avg_task_cost',
            'ROUND(SUM(task.cost), 2) as total_cost',
            'ROUND(SUM(CASE WHEN task.status = \'completed\' THEN task.cost ELSE 0 END), 2) as completed_value',
        ])
            .where('task.created_at >= :since', { since: new Date(Date.now() - 12 * 7 * 24 * 60 * 60 * 1000) })
            .groupBy('DATE_TRUNC(\'week\', task.created_at)')
            .orderBy('week', 'DESC');
        if (teamId) {
            weeklyTrendsQuery.andWhere('task.team_id = :teamId', { teamId });
        }
        const weeklyTrends = await weeklyTrendsQuery.getRawMany();
        const totalTasks = parseInt(overview.total_tasks) || 0;
        const completedTasks = parseInt(overview.completed_tasks) || 0;
        const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100) : 0;
        const avgEstimatedHours = parseFloat(overview.avg_estimated_hours) || 0;
        const avgActualHours = parseFloat(overview.avg_actual_hours) || 0;
        const estimationAccuracy = avgEstimatedHours > 0 ? (avgActualHours / avgEstimatedHours * 100) : 0;
        return {
            overview: {
                total_tasks: totalTasks,
                completed_tasks: completedTasks,
                active_tasks: parseInt(overview.active_tasks) || 0,
                overdue_tasks: parseInt(overview.overdue_tasks) || 0,
                due_soon_tasks: parseInt(overview.due_soon_tasks) || 0,
                total_cost: parseFloat(overview.total_cost) || 0,
                completed_value: parseFloat(overview.completed_value) || 0,
                pending_value: parseFloat(overview.pending_value) || 0,
                completion_rate: Math.round(completionRate * 100) / 100,
                estimation_accuracy: Math.round(estimationAccuracy * 100) / 100,
            },
            user_productivity: userProductivity.map(user => ({
                ...user,
                completed_tasks: parseInt(user.completed_tasks) || 0,
                active_tasks: parseInt(user.active_tasks) || 0,
                overdue_tasks: parseInt(user.overdue_tasks) || 0,
                total_revenue: parseFloat(user.total_revenue) || 0,
                pending_value: parseFloat(user.pending_value) || 0,
                avg_hours_per_task: parseFloat(user.avg_hours_per_task) || 0,
                total_hours_worked: parseFloat(user.total_hours_worked) || 0,
                total_assignments: parseInt(user.total_assignments) || 0,
                productivity_score: this.calculateProductivityScore(user),
            })),
            weekly_trends: weeklyTrends.map(trend => ({
                ...trend,
                tasks_created: parseInt(trend.tasks_created) || 0,
                tasks_completed: parseInt(trend.tasks_completed) || 0,
                tasks_active: parseInt(trend.tasks_active) || 0,
                avg_task_cost: parseFloat(trend.avg_task_cost) || 0,
                total_cost: parseFloat(trend.total_cost) || 0,
                completed_value: parseFloat(trend.completed_value) || 0,
                completion_rate: trend.tasks_created > 0 ?
                    Math.round((trend.tasks_completed / trend.tasks_created * 100) * 100) / 100 : 0,
            })),
            temporal_workflows: {
                notification_workflows_active: parseInt(overview.active_tasks) || 0,
                analytics_workflow_status: 'running',
                anomaly_detection_status: 'running',
            },
            generated_at: new Date(),
            data_freshness: 'real-time',
        };
    }
    async findTaskById(id) {
        const task = await this.taskRepository.findOne({ where: { id } });
        if (!task) {
            throw new common_1.NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }
    createTaskQueryBuilder() {
        return this.taskRepository
            .createQueryBuilder('task')
            .leftJoinAndSelect('task.category', 'category')
            .leftJoinAndSelect('task.team', 'team')
            .leftJoinAndSelect('task.created_by', 'creator')
            .leftJoinAndSelect('task.assignments', 'assignment', 'assignment.is_active = :isActive', { isActive: true })
            .leftJoinAndSelect('assignment.user', 'assignee');
    }
    applyTaskFilters(queryBuilder, filters) {
        if (filters.teamId) {
            queryBuilder.andWhere('task.team_id = :teamId', { teamId: filters.teamId });
        }
        if (filters.categoryId) {
            queryBuilder.andWhere('task.category_id = :categoryId', { categoryId: filters.categoryId });
        }
        if (filters.dueDate) {
            queryBuilder.andWhere('task.due_date <= :dueDate', { dueDate: filters.dueDate });
        }
        if (filters.assignedUserId) {
            queryBuilder.andWhere('assignee.id = :userId', { userId: filters.assignedUserId });
        }
        if (filters.assignedUser) {
            queryBuilder.andWhere('(assignee.name LIKE :userName OR assignee.email LIKE :userEmail)', {
                userName: `%${filters.assignedUser}%`,
                userEmail: `%${filters.assignedUser}%`,
            });
        }
    }
    applySorting(queryBuilder, sort) {
        switch (sort) {
            case 'due_date_asc':
                queryBuilder.orderBy('task.due_date', 'ASC');
                break;
            case 'due_date_desc':
                queryBuilder.orderBy('task.due_date', 'DESC');
                break;
            case 'priority':
                queryBuilder.orderBy(`CASE task.priority 
             WHEN 'urgent' THEN 1 
             WHEN 'high' THEN 2 
             WHEN 'medium' THEN 3 
             WHEN 'low' THEN 4 
             END`, 'ASC');
                break;
            case 'title':
                queryBuilder.orderBy('task.title', 'ASC');
                break;
            case 'created_at_asc':
                queryBuilder.orderBy('task.created_at', 'ASC');
                break;
            default:
                queryBuilder.orderBy('task.created_at', 'DESC');
        }
    }
    mapTaskToResponseDto(task) {
        return {
            id: task.id,
            title: task.title,
            description: task.description || '',
            estimated_hours: task.estimatedHours,
            actual_hours: task.actual_hours,
            cost: task.cost,
            dueDate: task.due_date,
            status: task.status,
            priority: task.priority,
            created_at: task.created_at?.toISOString(),
            updated_at: task.updated_at?.toISOString(),
            completedAt: task.completed_at?.toISOString(),
            categoryId: task.category?.id,
            category: task.category ? {
                id: task.category.id,
                name: task.category.name,
                color: task.category.color,
            } : undefined,
            team: task.team ? {
                id: task.team.id,
                name: task.team.name,
                slug: task.team.slug,
            } : undefined,
            parent_task_id: task.parent_task_id,
            started_at: task.started_at,
            created_by_name: task.created_by?.name || 'Unknown',
            assignee_count: task.assignee_count,
            completion_percentage: task.completion_percentage,
            assignees: task.assignments?.map(assignment => ({
                id: assignment.user.id,
                name: assignment.user.name,
                email: assignment.user.email,
                avatar_url: assignment.user.avatar_url,
                is_primary: assignment.is_primary,
                hours_allocated: assignment.hours_allocated,
                accepted_at: assignment.accepted_at,
            })) || [],
            is_overdue: task.status === enums_1.TaskStatus.ACTIVE && task.due_date < new Date(),
            is_due_soon: task.status === enums_1.TaskStatus.ACTIVE && task.due_date <= new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            comments_count: task.comments_count,
            attachments_count: task.attachments_count,
            assignedUserIds: task.assignments?.map(assignment => assignment.user.id) || [],
        };
    }
    async assignUsersToTask(taskId, userIds, assignedBy) {
        const assignments = userIds.map((userId, index) => this.taskAssignmentRepository.create({
            task_id: taskId,
            user_id: userId,
            assigned_by: assignedBy,
            is_primary: index === 0,
        }));
        await this.taskAssignmentRepository.save(assignments);
    }
    async reassignTaskUsers(taskId, userIds, assignedBy) {
        await this.taskAssignmentRepository.update({ task_id: taskId, is_active: true }, { is_active: false });
        if (userIds.length > 0) {
            await this.assignUsersToTask(taskId, userIds, assignedBy);
        }
    }
    calculateProductivityScore(user) {
        const completed = parseInt(user.completed_tasks) || 0;
        const overdue = parseInt(user.overdue_tasks) || 0;
        const revenue = parseFloat(user.total_revenue) || 0;
        const baseScore = completed * 10;
        const penaltyScore = overdue * 5;
        const revenueBonus = revenue / 100;
        return Math.max(0, Math.round(baseScore - penaltyScore + revenueBonus));
    }
    isValidUUID(uuid) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(uuid);
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(task_entity_1.Task)),
    __param(1, (0, typeorm_1.InjectRepository)(task_assignment_entity_1.TaskAssignment)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        users_service_1.UsersService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map