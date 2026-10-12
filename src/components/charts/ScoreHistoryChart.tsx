"use client";

import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface ScorePoint {
  date: string;
  personal: number | null;
  studi: number | null;
  teman: number | null;
  dosen: number | null;
}

const SERIES = [
  { key: "personal", name: "Personal", color: "#1E3A5F" },
  { key: "studi", name: "Studi", color: "#3B82C4" },
  { key: "teman", name: "Teman kuliah", color: "#2E9E6B" },
  { key: "dosen", name: "Dosen", color: "#B7791F" },
] as const;

/** Perkembangan skor per dimensi antar-asesmen. Garis putus-putus = batas kategori sedang (50) dan tinggi (75). */
export function ScoreHistoryChart({ data }: { data: ScorePoint[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#EEF3F9" />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
          <ReferenceLine y={50} stroke="#F2B705" strokeDasharray="4 4" />
          <ReferenceLine y={75} stroke="#D9534F" strokeDasharray="4 4" />
          <Tooltip formatter={(v: number) => `${v}%`} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {SERIES.map((s) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color} strokeWidth={2} dot={{ r: 3 }} connectNulls />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
