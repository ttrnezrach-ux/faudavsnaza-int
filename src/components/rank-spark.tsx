import { RANK_DAYS, type Country } from "@/lib/data";

export function RankSpark({ country, days = RANK_DAYS }: { country: Country; days?: string[] }) {
  const w = 132;
  const h = 36;
  const pts = country.ranks;
  const xs = pts.map((_, i) => (i / Math.max(pts.length - 1, 1)) * w);
  const yOf = (rank: number) => 4 + ((rank - 1) / 9) * (h - 8);
  const d = pts
    .map((rank, i) => {
      if (rank == null) return null;
      const cmd = i === 0 || pts.slice(0, i).every((p) => p == null) ? "M" : "L";
      return `${cmd}${xs[i]!.toFixed(1)},${yOf(rank).toFixed(1)}`;
    })
    .filter(Boolean)
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-9 w-[132px] text-heat"
      role="img"
      aria-label="מגמת דירוג"
    >
      <line x1="0" y1={yOf(1)} x2={w} y2={yOf(1)} stroke="currentColor" strokeOpacity="0.15" />
      {d && (
        <path
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}
      {pts.map((rank, i) =>
        rank == null ? null : (
          <circle
            key={days[i] ?? i}
            cx={xs[i]}
            cy={yOf(rank)}
            r={rank === 1 ? 2.6 : 1.8}
            fill="var(--color-foreground)"
          />
        ),
      )}
    </svg>
  );
}
