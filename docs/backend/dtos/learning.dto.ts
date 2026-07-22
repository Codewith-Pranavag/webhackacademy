import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsInt, IsOptional, IsUUID, Min } from "class-validator";

export class EnrollDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  courseId!: string;
}

export class LessonProgressDto {
  @ApiPropertyOptional({ minimum: 0, description: "Total seconds watched" })
  @IsOptional()
  @IsInt()
  @Min(0)
  watchedSeconds?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}
