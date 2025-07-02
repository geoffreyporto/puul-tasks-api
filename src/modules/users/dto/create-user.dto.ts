// src/modules/users/dto/create-user.dto.ts
import { IsString, IsNotEmpty, Length, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({ example: 'juan.perez@puul.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePassword123', required: false })
  @IsString()
  @IsOptional()
  @Length(8, 100)
  password?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MEMBER })
  @IsEnum(UserRole)
  role: UserRole;
}