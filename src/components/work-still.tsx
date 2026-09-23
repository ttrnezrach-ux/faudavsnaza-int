import { cn } from "@/lib/utils";
import type { WorkId } from "@/lib/work";

export const WORK_STILL: Record<WorkId, string> = {
  fauda: "/works/fauda.jpg",
  naza: "/works/naza.jpg",
};

export function WorkStill({
  id,
  alt,
  className,
  sizes,
  priority = false,
}: {
  id: WorkId;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <img
      src={WORK_STILL[id]}
      alt={alt}
      width={1400}
      height={788}
      sizes={sizes}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("still h-full w-full object-cover", className)}
    />
  );
}

export function WorkThumb({ id, className }: { id: WorkId | "compare"; className?: string }) {
  if (id === "compare") {
    return (
      <img
        src="/icon-192.png"
        alt=""
        width={28}
        height={28}
        className={cn("size-7 rounded-md object-cover still", className)}
        aria-hidden="true"
      />
    );
  }
  return (
    <img
      src={WORK_STILL[id]}
      alt=""
      width={28}
      height={28}
      className={cn(
        "size-7 rounded-md object-cover still",
        id === "fauda" ? "object-right" : "object-center",
        className,
      )}
      aria-hidden="true"
    />
  );
}
