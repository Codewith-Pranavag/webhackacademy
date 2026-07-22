import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  MaxLength,
  Min,
} from "class-validator";

export class SubmitAssignmentDto {
  @ApiProperty({ type: [String], format: "uuid", minItems: 1, description: "Uploaded media asset ids" })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(20)
  @IsUUID("4", { each: true })
  attachments!: string[];

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  comment?: string;
}

export class GradeSubmissionDto {
  @ApiProperty({ minimum: 0, maximum: 100, description: "Capped at the assignment's max points server-side" })
  @IsInt()
  @Min(0)
  @Max(100)
  grade!: number;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  feedback?: string;
}
