import Link from "next/link";
import { requireSession } from "@/lib/auth";
import { listAssessments, listCheckIns } from "@/lib/queries";
import { shouldReassess, summarizeTrend } from "@/lib/trend";
import { DIMENSIONS } from "@/lib/cbi";
import { formatDate } from "@/lib/ui";
import { DimensionBars } from "@/components/DimensionBars";
import { ReferralCard } from "@/components/ReferralCard";

export const metadata = { title: "Beranda – PenguHealth" };

export default async function DashboardPage() {
  const session = await requireSession();
  const [assessments, checkIns] = await Promise.all([listAssessments(session.sub), listCheckIns(session.sub)]);

  const last = assessments.at(-1) ?? null;
  const trend = summarizeTrend(checkIns.map((c) => ({ date: c.day, mood: c.mood, energy: c.energy, sleepHours: c.sleepHours })));
  const reassess = shouldReassess(last?.createdAt ?? null, trend);

  // Tanggal "hari ini" di server memakai WIB sebagai acuan tampilan.
  const today = new Date(Date.now() + 7 * 3_600_000).toISOString().slice(0, 10);
  const checkedInToday = checkIns.some((c) => c.day === today);

  return (
    <div className="space-y-6">
      <div>
        <p className="muted">Halo, {session.name}</p>
        <h1 className="text-2xl">Bagaimana kabarmu hari ini?</h1>
      </div>

      {reassess.due && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-es bg-es-100 px-5 py-4">
          <p className="text-sm text-laut">
            <strong>Saatnya asesmen.</strong> {reassess.reason}
          </p>
          <Link href="/asesmen" className="btn-primary">Mulai asesmen</Link>
        </div>
      )}

      {last?.needsReferral && <ReferralCard />}

      <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
        <section className="card">
          <div className="mb-4 flex items-center justify-between gap-2">
            <h2 className="text-base">Asesmen terakhir</h2>
            {last && <Link href={`/hasil/${last.id}`} className="text-sm font-semibold text-laut underline">Detail</Link>}
          </div>
          {last ? (
            <>
              <p className="muted mb-4">
                {formatDate(last.createdAt)}
                {last.dominant && <> · Sumber utama: {DIMENSIONS[last.dominant].label.toLowerCase()}</>}
              </p>
              <DimensionBars dimensions={last.dimensions} dominant={last.dominant} />
            </>
          ) : (
            <p className="text-sm text-slate-600">Anda belum mengisi asesmen. Mulai dengan 25 pertanyaan singkat.</p>
          )}
        </section>

        <section className="card flex flex-col gap-4">
          <h2 className="text-base">Check-in harian</h2>
          {checkedInToday ? (
            <p className="rounded-xl bg-rendah/10 px-4 py-3 text-sm text-rendah">Check-in hari ini sudah tersimpan.</p>
          ) : (
            <p className="text-sm text-slate-600">Anda belum check-in hari ini.</p>
          )}
          <div>
            <p className="muted">Tren kesejahteraan (7 check-in)</p>
            <p className="font-judul text-3xl font-semibold text-laut">
              {trend.latestEwma === null ? "–" : Math.round(trend.latestEwma)}
              <span className="ml-1 text-base text-slate-400">/100</span>
            </p>
            {trend.change7 !== null && (
              <p className={`text-sm ${trend.change7 < 0 ? "text-tinggi" : "text-rendah"}`}>
                {trend.change7 >= 0 ? "Naik" : "Turun"} {Math.abs(trend.change7)} poin dalam 7 check-in
              </p>
            )}
          </div>
          <Link href="/checkin" className="btn-secondary mt-auto">{checkedInToday ? "Perbarui check-in" : "Isi check-in"}</Link>
        </section>
      </div>
    </div>
  );
}
