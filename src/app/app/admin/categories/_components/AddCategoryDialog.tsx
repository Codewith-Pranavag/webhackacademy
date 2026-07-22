"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export const CATEGORY_COLORS = [
  "#5633d1",
  "#5ac0ff",
  "#5dbe74",
  "#ffb45a",
  "#ff7b8e",
  "#855be2",
] as const;

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  color: z.string().min(1, "Pick a color"),
});

export type CategoryFormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-[var(--radius)] border border-line bg-surface px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-muted focus:border-violet";

export function AddCategoryDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CategoryFormValues) => void;
}) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", color: CATEGORY_COLORS[0] },
  });

  const color = watch("color");

  const close = () => {
    reset();
    onClose();
  };

  const submit = handleSubmit((values) => {
    onCreate(values);
    reset();
    onClose();
  });

  return (
    <Dialog
      open={open}
      onClose={close}
      title="Add category"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={close}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit}>
            Create
          </Button>
        </>
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Category name</span>
          <input
            placeholder="e.g. Cloud Computing"
            className={inputClass}
            {...register("name")}
          />
          {errors.name && (
            <span className="text-xs font-medium text-orange">{errors.name.message}</span>
          )}
        </label>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Color</span>
          <div className="flex gap-2">
            {CATEGORY_COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setValue("color", c, { shouldValidate: true })}
                aria-label={`Select color ${c}`}
                className={`h-9 w-9 rounded-full transition-transform ${
                  color === c ? "scale-110 ring-2 ring-offset-2 ring-ink/30" : ""
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
          {errors.color && (
            <span className="text-xs font-medium text-orange">{errors.color.message}</span>
          )}
        </div>
      </form>
    </Dialog>
  );
}
