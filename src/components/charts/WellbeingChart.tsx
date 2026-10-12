"use client";

import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export interface WellbeingPoint {
  date: string;
  index: number;
  ewma: number;
}

/** Indeks kesejahteraan harian dan garis tren yang dihaluskan (EWMA). */
export function WellbeingChart({ data }: { data: WellbeingPoint[] }) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="#EEF3F9" />
          <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} />
          <YAxis domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} tick={{ fill: "#64748b", fontSize: 12 }} />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line type="monotone" dataKey="index" name="Indeks harian" stroke="#7FB8E6" strokeWidth={1.5} dot={{ r: 2 }} />
          <Line type="monotone" dataKey="ewma" name="Tren" stroke="#1E3A5F" strokeWidth={2.5} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
