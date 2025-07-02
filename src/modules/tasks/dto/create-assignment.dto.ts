// src/modules/tasks/dto/create-assignment.dto.ts
import { IsString, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAssignmentDto {
  @ApiProperty({ description: 'ID of the task to assign the user to' })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  taskId: string;
  
  @ApiProperty({ description: 'ID of the user to assign to the task' })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID of the user who is making the assignment' })
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  assignedBy: string; 
}
