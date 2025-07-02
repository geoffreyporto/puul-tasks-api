// src/modules/users/dto/user-filters.dto.ts
import { IsString, IsOptional, IsEnum, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../../common/enums';
import { Transform } from 'class-transformer';

export class UserFiltersDto {
  @ApiProperty({ description: 'Filter by name', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Filter by email', required: false })
  @IsString()
  @IsOptional()
  email?: string;

  @ApiProperty({ enum: UserRole, description: 'Filter by role', required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiProperty({ example: 1, description: 'Page number', default: 1 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  page = 1;

  @ApiProperty({ example: 10, description: 'Items per page', default: 10 })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Transform(({ value }) => parseInt(value, 10))
  limit = 10;

  get offset(): number {
    return (this.page - 1) * this.limit;
  }
}
