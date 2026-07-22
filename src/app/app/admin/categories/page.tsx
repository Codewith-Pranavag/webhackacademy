"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderTree, BookOpen } from "lucide-react";
import { PageHeader } from "@/components/app/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/feedback";
import { toast } from "@/store/toast";
import { formatNumber } from "@/lib/format";
import {
  AddCategoryDialog,
  type CategoryFormValues,
} from "./_components/AddCategoryDialog";

interface Category {
  id: string;
  name: string;
  slug: string;
  courses: number;
  color: string;
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const SEED: Category[] = [
  { id: "cat_1", name: "Web Development", slug: "web-development", courses: 312, color: "#5633d1" },
  { id: "cat_2", name: "Data Science", slug: "data-science", courses: 248, color: "#5ac0ff" },
  { id: "cat_3", name: "Design", slug: "design", courses: 196, color: "#ff7b8e" },
  { id: "cat_4", name: "Cybersecurity", slug: "cybersecurity", courses: 134, color: "#5dbe74" },
  { id: "cat_5", name: "Business", slug: "business", courses: 175, color: "#ffb45a" },
  { id: "cat_6", name: "Marketing", slug: "marketing", courses: 121, color: "#855be2" },
  { id: "cat_7", name: "Motion & 3D", slug: "motion-3d", courses: 88, color: "#5ac0ff" },
  { id: "cat_8", name: "Cloud & DevOps", slug: "cloud-devops", courses: 143, color: "#5633d1" },
];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(SEED);
  const [addOpen, setAddOpen] = useState(false);

  const handleCreate = (values: CategoryFormValues) => {
    const next: Category = {
      id: `cat_${Date.now()}`,
      name: values.name,
      slug: slugify(values.name),
      courses: 0,
      color: values.color,
    };
    setCategories((prev) => [next, ...prev]);
    toast.success("Category created", `"${values.name}" was added.`);
  };

  const handleDelete = (cat: Category) => {
    setCategories((prev) => prev.filter((c) => c.id !== cat.id));
    toast.warning("Category deleted", `"${cat.name}" was removed.`);
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Organize the catalog into browsable categories."
        action={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4" /> Add category
          </Button>
        }
      />

      {categories.length === 0 ? (
        <EmptyState
          icon={<FolderTree className="h-7 w-7" />}
          title="No categories yet"
          description="Create your first category to organize courses."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus className="h-4 w-4" /> Add category
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((cat) => (
            <Card key={cat.id} className="group flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-white"
                  style={{ background: cat.color }}
                >
                  <FolderTree className="h-5 w-5" />
                </span>
                <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => toast.info("Edit category", `Editing "${cat.name}".`)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-soft hover:text-violet-deep"
                    aria-label={`Edit ${cat.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted transition-colors hover:bg-orange/10 hover:text-orange"
                    aria-label={`Delete ${cat.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-ink">{cat.name}</h3>
                <p className="text-xs text-muted">/{cat.slug}</p>
              </div>
              <p className="mt-auto inline-flex items-center gap-1.5 text-sm text-body">
                <BookOpen className="h-4 w-4 text-muted" />
                {formatNumber(cat.courses)} courses
              </p>
            </Card>
          ))}
        </div>
      )}

      <AddCategoryDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
