import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/constants/data";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href="/courses"
      className="group flex items-center gap-4 rounded-[var(--radius-lg)] border border-line bg-white p-5 transition-all duration-400 ease-[var(--ease-out-soft)] hover:-translate-y-1 hover:border-violet/40 hover:shadow-[var(--shadow-soft)]"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-50 transition-colors group-hover:bg-violet-100">
        <Image
          src={category.icon}
          alt=""
          width={28}
          height={28}
          className="h-7 w-7 object-contain"
        />
      </span>
      <span className="flex flex-col">
        <span className="font-semibold text-ink transition-colors group-hover:text-violet-deep">
          {category.name}
        </span>
        <span className="text-sm text-muted">{category.courses} Courses</span>
      </span>
    </Link>
  );
}
