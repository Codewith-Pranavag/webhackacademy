import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

/**
 * Section title in the template style: the last word rendered in violet.
 * e.g. "Trending <Courses>".
 */
export function SectionHeading({
  lead,
  highlight,
  align = "center",
  eyebrow,
  className,
}: {
  lead: string;
  highlight?: string;
  align?: "center" | "left";
  eyebrow?: string;
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-pill bg-violet-50 px-4 py-1.5 text-sm font-medium text-violet-deep">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl font-semibold sm:text-4xl md:text-[2.75rem]">
        {lead}
        {highlight && <span className="text-violet"> {highlight}</span>}
      </h2>
    </Reveal>
  );
}
