import { DIMENSIONS, DIMENSION_ORDER, type DimensionKey, type Level } from "@/lib/cbi";
import { LEVEL_STYLE } from "@/lib/ui";
import { LevelBadge } from "./LevelBadge";

type Dims = Record<DimensionKey, { score: number | null; level: Level | null }>;

/** Skor per dimensi sebagai batang 0–100 dengan warna kategori. */
export function DimensionBars({ dimensions, dominant }: { dimensions: Dims; dominant: DimensionKey | null }) {
  return (
    <ul className="space-y-4">
      {DIMENSION_ORDER.map((key) => {
        const d = dimensions[key];
        const width = d.score ?? 0;
        return (
          <li key={key}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-laut">
                {DIMENSIONS[key].label}
                {dominant === key && <span className="ml-2 text-xs font-normal text-slate-500">(tertinggi)</span>}
              </span>
              <span className="flex items-center gap-2">
                <span className="font-judul text-sm font-semibold">{d.score === null ? "–" : `${d.score}%`}</span>
                <LevelBadge level={d.level} />
              </span>
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-laut-50" role="presentation">
              <div
                className={`h-full rounded-full ${d.level ? LEVEL_STYLE[d.level].bar : "bg-slate-300"}`}
                style={{ width: `${width}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">{DIMENSIONS[key].description}</p>
          </li>
        );
      })}
    </ul>
  );
}
