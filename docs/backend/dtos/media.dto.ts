import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsInt, IsMimeType, IsString, Max, MaxLength, Min } from "class-validator";

export const MEDIA_KINDS = ["video", "image", "pdf", "archive", "doc"] as const;
export type MediaKind = (typeof MEDIA_KINDS)[number];

const GB = 1024 * 1024 * 1024;

export class CreateUploadDto {
  @ApiProperty({ maxLength: 255 })
  @IsString()
  @MaxLength(255)
  filename!: string;

  @ApiProperty({ example: "video/mp4" })
  @IsMimeType()
  mime!: string;

  @ApiProperty({ minimum: 1, maximum: 5 * GB, description: "Bytes. Per-kind caps enforced server-side." })
  @IsInt()
  @Min(1)
  @Max(5 * GB)
  size!: number;

  @ApiProperty({ enum: MEDIA_KINDS })
  @IsIn(MEDIA_KINDS)
  kind!: MediaKind;
}
