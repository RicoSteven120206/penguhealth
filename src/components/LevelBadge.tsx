import { LEVEL_LABEL, type Level } from "@/lib/cbi";
import { LEVEL_STYLE } from "@/lib/ui";

export function LevelBadge({ level }: { level: Level | null }) {
  if (!level) return <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">Data kurang</span>;
  const s = LEVEL_STYLE[level];
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.bg} ${s.text}`}>{LEVEL_LABEL[level]}</span>
  );
}
