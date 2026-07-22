import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsObject } from "class-validator";

/**
 * Answers keyed by questionId. Value is either an array of selected option
 * indices (single/multi/boolean) or a string (fill/code).
 * Deep validation happens in the service against the quiz definition, because
 * valid shape depends on each question's type.
 */
export class SubmitQuizDto {
  @ApiProperty({
    type: "object",
    additionalProperties: {
      oneOf: [{ type: "array", items: { type: "integer" } }, { type: "string" }],
    },
    example: { q_1_1: [1], q_1_4: "grid" },
  })
  @IsDefined()
  @IsObject()
  answers!: Record<string, number[] | string>;
}

/** Partial autosave uses the same shape. */
export class AutosaveQuizDto extends SubmitQuizDto {}
