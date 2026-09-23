import type { Country } from "@/lib/data";
import { cn } from "@/lib/utils";

export function SentimentBar({
  country,
  className,
}: {
  country: Country;
  className?: string;
}) {
  return (
    <div
      className={cn("flex h-1.5 w-full overflow-hidden rounded-full bg-muted", className)}
      role="img"
      aria-label={`חיובי ${country.positive}%, מעורב ${country.mixed}%, ביקורתי ${country.negative}%`}
    >
      <span className="h-full bg-positive" style={{ width: `${country.positive}%` }} />
      <span className="h-full bg-mixed" style={{ width: `${country.mixed}%` }} />
      <span className="h-full bg-negative" style={{ width: `${country.negative}%` }} />
    </div>
  );
}
