import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from "class-validator";
import { PaginationQueryDto } from "./common.dto";

export const COURSE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export type CourseLevel = (typeof COURSE_LEVELS)[number];

export class ListCoursesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: COURSE_LEVELS })
  @IsOptional()
  @IsIn(COURSE_LEVELS)
  level?: CourseLevel;
}

export class CreateCourseDto {
  @ApiProperty({ minLength: 5, maxLength: 120 })
  @IsString()
  @MinLength(5)
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ maxLength: 160 })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  subtitle?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmptyCategory()
  category!: string;

  @ApiProperty({ enum: COURSE_LEVELS })
  @IsIn(COURSE_LEVELS)
  level!: CourseLevel;

  @ApiPropertyOptional({ minimum: 0, description: "Price in minor units (cents); 0 = free" })
  @IsOptional()
  @IsInt()
  @Min(0)
  priceCents?: number;
}

// Illustrative custom-decorator placeholder (real impl would verify the category exists).
function IsNotEmptyCategory() {
  return MinLength(1);
}

export class CreateReviewDto {
  @ApiProperty({ minimum: 1, maximum: 5 })
  @IsInt()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({ maxLength: 2000 })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  body?: string;
}
