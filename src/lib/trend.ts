/**
 * Analisis tren check-in harian (tanpa machine learning).
 *
 * Indeks kesejahteraan harian (0–100) dihitung dari mood, energi, dan jam tidur.
 * Tren dihaluskan dengan EWMA (Exponentially Weighted Moving Average).
 * Asesmen ulang disarankan jika:
 *   - sudah >= 14 hari sejak asesmen terakhir, atau
 *   - EWMA turun >= 10 poin dalam 7 check-in terakhir.
 */

export interface CheckInLike {
  date: Date | string;
  mood: number; // 1–5
  energy: number; // 1–5
  sleepHours: number; // 0–24
}

export function wellbeingIndex(c: Pick<CheckInLike, "mood" | "energy" | "sleepHours">): number {
  const mood = ((c.mood - 1) / 4) * 100;
  const energy = ((c.energy - 1) / 4) * 100;
  // Tidur 7–9 jam dianggap ideal (100); makin jauh dari rentang itu makin rendah.
  const s = c.sleepHours;
  const sleep = s >= 7 && s <= 9 ? 100 : Math.max(0, 100 - Math.min(Math.abs(s - 7), Math.abs(s - 9)) * 20);
  return Math.round(mood * 0.4 + energy * 0.4 + sleep * 0.2);
}

export function ewma(values: number[], alpha = 0.3): number[] {
  const out: number[] = [];
  values.forEach((v, i) => {
    out.push(i === 0 ? v : Math.round((alpha * v + (1 - alpha) * out[i - 1]) * 10) / 10);
  });
  return out;
}

export interface TrendSummary {
  points: { date: string; index: number; ewma: number }[];
  latestEwma: number | null;
  change7: number | null;
  declining: boolean;
}

export function summarizeTrend(checkIns: CheckInLike[]): TrendSummary {
  const sorted = [...checkIns].sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const indices = sorted.map(wellbeingIndex);
  const smooth = ewma(indices);
  const points = sorted.map((c, i) => ({
    date: new Date(c.date).toISOString().slice(0, 10),
    index: indices[i],
    ewma: smooth[i],
  }));

  const latestEwma = smooth.length ? smooth[smooth.length - 1] : null;
  const change7 = smooth.length >= 7 ? Math.round((smooth[smooth.length - 1] - smooth[smooth.length - 7]) * 10) / 10 : null;

  return { points, latestEwma, change7, declining: change7 !== null && change7 <= -10 };
}

export function shouldReassess(lastAssessmentAt: Date | string | null, trend: TrendSummary, now = new Date()): {
  due: boolean;
  reason: string | null;
} {
  if (!lastAssessmentAt) return { due: true, reason: "Anda belum pernah mengisi asesmen." };
  const days = (now.getTime() - new Date(lastAssessmentAt).getTime()) / 86_400_000;
  if (trend.declining) {
    return { due: true, reason: "Kondisi harian Anda menurun dalam seminggu terakhir." };
  }
  if (days >= 14) return { due: true, reason: `Sudah ${Math.floor(days)} hari sejak asesmen terakhir.` };
  return { due: false, reason: null };
}
