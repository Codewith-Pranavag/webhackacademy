import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateIf,
} from "class-validator";

/**
 * Either `items` (one-time course purchase) or `planId` (subscription) must be
 * present. Cross-field rule enforced with @ValidateIf.
 */
export class CheckoutDto {
  @ApiPropertyOptional({ type: [String], format: "uuid" })
  @ValidateIf((o: CheckoutDto) => !o.planId)
  @IsArray()
  @ArrayMaxSize(50)
  @IsUUID("4", { each: true })
  items?: string[];

  @ApiPropertyOptional()
  @ValidateIf((o: CheckoutDto) => !o.items?.length)
  @IsString()
  planId?: string;

  @ApiPropertyOptional({ maxLength: 40 })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  couponCode?: string;
}

export class CancelSubscriptionDto {
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  atPeriodEnd?: boolean;
}

export class ValidateCouponDto {
  @ApiPropertyOptional({ maxLength: 40 })
  @IsString()
  @MaxLength(40)
  code!: string;
}
