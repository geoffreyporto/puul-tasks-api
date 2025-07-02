// src/modules/users/dto/update-user.dto.ts
import { IsString, IsOptional, Length, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';

export class UpdateUserDto {
  @ApiProperty({ example: 'Juan Pérez', required: false })
  @IsString()
  @IsOptional()
  @Length(2, 100)
  name?: string;

  @ApiProperty({ example: 'juan.perez@puul.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: UserRole, example: UserRole.MEMBER, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty({ example: '+52 1 555 123 4567', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'America/Mexico_City', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
