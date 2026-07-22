import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from "class-validator";

export class SendMessageDto {
  @ApiProperty({ minLength: 1, maxLength: 4000 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4000)
  body!: string;

  @ApiPropertyOptional({ type: [String], format: "uuid" })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsUUID("4", { each: true })
  attachments?: string[];
}

export class CreateConversationDto {
  @ApiProperty({ format: "uuid" })
  @IsUUID()
  participantId!: string;
}
