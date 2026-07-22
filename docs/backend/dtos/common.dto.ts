/**
 * Reference DTOs for the future NestJS backend (design-stage).
 * These encode the validation rules and generate the OpenAPI schema.
 * They are excluded from the frontend build (see tsconfig "exclude": ["docs"]).
 *
 * Requires (backend package.json): class-validator, class-transformer, @nestjs/swagger.
 */
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from "class-validator";

/** Standard pagination + search query params. */
export class PaginationQueryDto {
  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({ minimum: 1, maximum: 100, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 20;

  @ApiPropertyOptional({ description: "Free-text query", maxLength: 120 })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @ApiPropertyOptional({ description: "Sort key, prefix '-' for desc", example: "-created_at" })
  @IsOptional()
  @IsString()
  sort?: string;
}

/** Generic paginated envelope (mirrors frontend Paginated<T>). */
export class PaginatedDto<T> {
  @ApiProperty({ isArray: true })
  items!: T[];

  @ApiProperty()
  total!: number;

  @ApiProperty()
  page!: number;

  @ApiProperty()
  pageSize!: number;
}

/** Standard error envelope returned by the global exception filter. */
export class ErrorDto {
  @ApiProperty({
    example: {
      code: "VALIDATION_ERROR",
      message: "Email is already in use.",
      details: [{ field: "email", message: "already_taken" }],
      requestId: "req_01H...",
      timestamp: "2026-07-22T10:00:00Z",
    },
  })
  error!: {
    code: string;
    message: string;
    details?: { field: string; message: string }[];
    requestId?: string;
    timestamp?: string;
  };
}
