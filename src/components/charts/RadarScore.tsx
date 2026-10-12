"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";

export interface RadarDatum {
  dimension: string;
  score: number;
}

/** Radar chart empat dimensi CBI-SV: menunjukkan sumber burnout secara sekilas. */
export function RadarScore({ data }: { data: RadarDatum[] }) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke="#D7E2EF" />
          <PolarAngleAxis dataKey="dimension" tick={{ fill: "#1E3A5F", fontSize: 13 }} />
          <PolarRadiusAxis domain={[0, 100]} tickCount={5} tick={{ fill: "#64748b", fontSize: 11 }} angle={90} />
          <Radar dataKey="score" name="Skor" stroke="#1E3A5F" fill="#7FB8E6" fillOpacity={0.45} strokeWidth={2} />
          <Tooltip formatter={(v: number) => [`${v}%`, "Skor"]} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
