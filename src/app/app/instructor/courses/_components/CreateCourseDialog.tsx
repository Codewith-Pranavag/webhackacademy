"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { toast } from "@/store/toast";
import {
  fieldClass,
  COURSE_CATEGORIES,
  COURSE_LEVELS,
} from "../../_components/helpers";

const schema = z.object({
  title: z.string().min(3, "Give your course a clear title"),
  category: z.enum(COURSE_CATEGORIES),
  price: z
    .string()
    .min(1, "Enter a price")
    .regex(/^(Free|\$?\d+(\.\d{1,2})?)$/i, "Use “Free” or an amount like 49 or $49"),
  level: z.enum(COURSE_LEVELS),
});

type Values = z.infer<typeof schema>;

export function CreateCourseDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { category: "Design", level: "Beginner" },
  });

  const close = () => {
    reset();
    onClose();
  };

  const onSubmit = handleSubmit(async (values) => {
    await new Promise((r) => setTimeout(r, 500));
    toast.success("Course created", `“${values.title}” was added as a draft.`);
    close();
  });

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Create a new course"
      footer={
        <>
          <Button variant="outline" size="sm" type="button" onClick={close}>
            Cancel
          </Button>
          <Button
            size="sm"
            type="submit"
            form="create-course-form"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating…" : "Create course"}
          </Button>
        </>
      }
    >
      <form id="create-course-form" onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label htmlFor="cc-title" className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Course title</span>
          <input
            id="cc-title"
            className={fieldClass}
            placeholder="e.g. Advanced TypeScript Patterns"
            {...register("title")}
          />
          {errors.title && (
            <span className="text-xs font-medium text-orange">{errors.title.message}</span>
          )}
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label htmlFor="cc-category" className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">Category</span>
            <select id="cc-category" className={fieldClass} {...register("category")}>
              {COURSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="text-xs font-medium text-orange">{errors.category.message}</span>
            )}
          </label>

          <label htmlFor="cc-level" className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">Level</span>
            <select id="cc-level" className={fieldClass} {...register("level")}>
              {COURSE_LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            {errors.level && (
              <span className="text-xs font-medium text-orange">{errors.level.message}</span>
            )}
          </label>
        </div>

        <label htmlFor="cc-price" className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Price</span>
          <input
            id="cc-price"
            className={fieldClass}
            placeholder="Free or $49"
            {...register("price")}
          />
          {errors.price && (
            <span className="text-xs font-medium text-orange">{errors.price.message}</span>
          )}
        </label>
      </form>
    </Dialog>
  );
}
