import { DIMENSIONS } from "@/lib/cbi";
import type { Recommendation } from "@/lib/recommendations";

export function RecommendationList({ items }: { items: Recommendation[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {items.map((r) => (
        <article key={r.id} className="card">
          <p className="text-xs font-semibold uppercase tracking-wide text-es">
            {r.dimension === "umum" ? "Umum" : `Dimensi ${DIMENSIONS[r.dimension].label}`}
          </p>
          <h3 className="mt-1 text-base">{r.title}</h3>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
            {r.steps.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
