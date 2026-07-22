import Image from "next/image";
import { Quote } from "lucide-react";
import type { Testimonial } from "@/constants/data";
import { StarRating } from "./StarRating";

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-[var(--radius-lg)] border border-line bg-white p-7 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <StarRating rating={testimonial.rating} />
        <Quote className="h-8 w-8 text-violet-100" />
      </div>
      <blockquote className="flex-1 text-[1.05rem] leading-relaxed text-ink/80">
        “{testimonial.quote}”
      </blockquote>
      <figcaption className="flex items-center gap-3 border-t border-line pt-5">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
        <span className="flex flex-col">
          <span className="font-semibold text-ink">{testimonial.name}</span>
          <span className="text-sm text-muted">{testimonial.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
