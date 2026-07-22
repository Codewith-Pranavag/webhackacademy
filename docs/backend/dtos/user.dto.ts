import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class UpdateProfileDto {
  @ApiPropertyOptional({ minLength: 2, maxLength: 80 })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  headline?: string;

  @ApiPropertyOptional({ maxLength: 1000 })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  bio?: string;

  @ApiPropertyOptional({ maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  location?: string;

  @ApiPropertyOptional({ type: [String], maxItems: 30 })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  skills?: string[];
}

export class UpdatePreferencesDto {
  @ApiPropertyOptional({ type: "object", additionalProperties: { type: "boolean" } })
  @IsOptional()
  email?: Record<string, boolean>;

  @ApiPropertyOptional({ type: "object", additionalProperties: { type: "boolean" } })
  @IsOptional()
  push?: Record<string, boolean>;

  @ApiPropertyOptional({ type: "object", additionalProperties: { type: "boolean" } })
  @IsOptional()
  inApp?: Record<string, boolean>;

  @ApiPropertyOptional({ enum: ["public", "students", "private"] })
  @IsOptional()
  @IsIn(["public", "students", "private"])
  profileVisibility?: "public" | "students" | "private";
}
