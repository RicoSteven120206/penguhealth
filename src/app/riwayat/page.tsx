import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { listAssessments, listCheckIns } from "@/lib/queries";
import { summarizeTrend } from "@/lib/trend";
import { formatDate, formatShortDate } from "@/lib/ui";
import { DIMENSIONS } from "@/lib/cbi";
import { LevelBadge } from "@/components/LevelBadge";
import { ScoreHistoryChart } from "@/components/charts/ScoreHistoryChart";
import { WellbeingChart } from "@/components/charts/WellbeingChart";

export const metadata = { title: "Riwayat – PenguHealth" };

export default async function RiwayatPage() {
  const session = await requireSession();
  const [assessments, checkIns] = await Promise.all([listAssessments(session.sub), listCheckIns(session.sub)]);

  const scoreData = assessments.map((a) => ({
    date: formatShortDate(a.createdAt),
    personal: a.dimensions.personal.score,
    studi: a.dimensions.studi.score,
    teman: a.dimensions.teman.score,
    dosen: a.dimensions.dosen.score,
  }));
  const trend = summarizeTrend(checkIns.map((c) => ({ date: c.day, mood: c.mood, energy: c.energy, sleepHours: c.sleepHours })));
  const wellbeing = trend.points.map((p) => ({ ...p, date: formatShortDate(p.date) }));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">Riwayat dan perkembangan</h1>

      <section className="card">
        <h2 className="text-base">Skor burnout per dimensi</h2>
        <p className="muted mb-2">Garis kuning = batas kategori sedang (50), garis merah = batas tinggi (75).</p>
        {scoreData.length >= 2 ? (
          <ScoreHistoryChart data={scoreData} />
        ) : (
          <p className="text-sm text-slate-600">Grafik tampil setelah Anda mengisi minimal dua asesmen.</p>
        )}
      </section>

      <section className="card">
        <h2 className="text-base">Kesejahteraan harian</h2>
        <p className="muted mb-2">Indeks dari mood, energi, dan jam tidur (0–100). Garis gelap adalah tren yang dihaluskan.</p>
        {wellbeing.length >= 2 ? (
          <WellbeingChart data={wellbeing} />
        ) : (
          <p className="text-sm text-slate-600">Grafik tampil setelah minimal dua check-in.</p>
        )}
      </section>

      <section className="card">
        <h2 className="mb-3 text-base">Daftar asesmen</h2>
        {assessments.length === 0 ? (
          <p className="text-sm text-slate-600">Belum ada asesmen.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-2 pr-4">Tanggal</th>
                  <th className="py-2 pr-4">Skor total</th>
                  <th className="py-2 pr-4">Kategori</th>
                  <th className="py-2 pr-4">Sumber utama</th>
                  <th className="py-2" />
                </tr>
              </thead>
              <tbody>
                {[...assessments].reverse().map((a) => (
                  <tr key={a.id} className="border-t border-laut-50">
                    <td className="py-2 pr-4">{formatDate(a.createdAt)}</td>
                    <td className="py-2 pr-4 font-semibold">{a.total === null ? "–" : `${a.total}%`}</td>
                    <td className="py-2 pr-4"><LevelBadge level={a.totalLevel} /></td>
                    <td className="py-2 pr-4">{a.dominant ? DIMENSIONS[a.dominant].label : "–"}</td>
                    <td className="py-2 text-right">
                      <Link href={`/hasil/${a.id}`} className="font-semibold text-laut underline">Lihat</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
