import Image from "next/image";
import { Twitter, Instagram, Linkedin } from "lucide-react";
import type { Mentor } from "@/constants/data";

export function MentorGridCard({ mentor }: { mentor: Mentor }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-line bg-white shadow-[var(--shadow-card)] transition-transform duration-500 hover:-translate-y-1.5">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src={mentor.image}
          alt={mentor.name}
          fill
          sizes="(max-width: 768px) 100vw, 300px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-ink/70 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {[Twitter, Instagram, Linkedin].map((Icon, k) => (
            <span
              key={k}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-violet-deep transition-colors hover:bg-violet-deep hover:text-white"
            >
              <Icon className="h-4 w-4" />
            </span>
          ))}
        </div>
      </div>
      <div className="p-5 text-center">
        <h3 className="font-semibold">{mentor.name}</h3>
        <p className="text-sm text-violet-deep">{mentor.role}</p>
      </div>
    </article>
  );
}
