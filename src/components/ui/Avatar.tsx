import Image from "next/image";
import { cn } from "@/lib/utils";

export function Avatar({
  src,
  name,
  size = 40,
  className,
  online,
}: {
  src?: string;
  name: string;
  size?: number;
  className?: string;
  online?: boolean;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn("relative inline-flex shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span
          className="flex h-full w-full items-center justify-center rounded-full bg-violet-100 font-semibold text-violet-deep"
          style={{ fontSize: size * 0.38 }}
        >
          {initials}
        </span>
      )}
      {online !== undefined && (
        <span
          className={cn(
            "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
            online ? "bg-green" : "bg-muted",
          )}
        />
      )}
    </span>
  );
}
