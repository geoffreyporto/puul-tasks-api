// src/modules/tasks/dto/create-task.dto.ts
import { IsString, IsNotEmpty, IsNumber, Min, IsDateString, IsArray, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implementar API de usuarios' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Desarrollar endpoints CRUD para gestión de usuarios' })
  @IsString()
  description: string;

  @ApiProperty({ example: 8.5 })
  @IsNumber()
  @Min(0.1)
  estimatedHours: number;

  @ApiProperty({ example: 1500.00 })
  @IsNumber()
  @Min(0)
  cost: number;

  @ApiProperty({ example: '2025-07-15T23:59:59.000Z' })
  @IsDateString()
  dueDate: string;

  @ApiProperty({ example: ['uuid-user-1', 'uuid-user-2'] })
  @IsArray()
  @IsUUID(4, { each: true })
  assignedUserIds: string[];
}