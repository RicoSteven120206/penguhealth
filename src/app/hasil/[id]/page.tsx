import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getAssessment } from "@/lib/queries";
import { DIMENSIONS, DIMENSION_ORDER, LEVEL_LABEL, type ScoreResult } from "@/lib/cbi";
import { buildRecommendations } from "@/lib/recommendations";
import { formatDate, LEVEL_STYLE } from "@/lib/ui";
import { ReferralCard } from "@/components/ReferralCard";
import { DimensionBars } from "@/components/DimensionBars";
import { RecommendationList } from "@/components/RecommendationList";
import { RadarScore } from "@/components/charts/RadarScore";
import { Disclaimer } from "@/components/Disclaimer";

export const metadata = { title: "Hasil asesmen – PenguHealth" };

export default async function HasilPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;
  const a = await getAssessment(session.sub, id);
  if (!a) notFound();

  // Bentuk ulang ke ScoreResult agar aturan rekomendasi sama dengan yang diuji.
  const result: ScoreResult = {
    dimensions: Object.fromEntries(
      DIMENSION_ORDER.map((k) => [k, { dimension: k, ...a.dimensions[k], answered: 0, total: 0 }]),
    ) as ScoreResult["dimensions"],
    total: a.total,
    totalLevel: a.totalLevel,
    dominant: a.dominant,
    needsReferral: a.needsReferral,
  };
  const recommendations = buildRecommendations(result);

  const radar = DIMENSION_ORDER.map((k) => ({ dimension: DIMENSIONS[k].label, score: a.dimensions[k].score ?? 0 }));
  const totalStyle = a.totalLevel ? LEVEL_STYLE[a.totalLevel] : null;

  return (
    <div className="space-y-8">
      <div>
        <p className="muted">Asesmen {formatDate(a.createdAt)}</p>
        <h1 className="text-2xl">Hasil asesmen Anda</h1>
      </div>

      {/* Aturan keselamatan: rujukan tampil paling atas bila ada dimensi tinggi. */}
      {a.needsReferral && <ReferralCard />}

      <section className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <div className="card flex flex-col justify-between gap-4">
          <div>
            <p className="muted">Skor burnout keseluruhan</p>
            <p className={`font-judul text-5xl font-semibold ${totalStyle?.text ?? "text-laut"}`}>
              {a.total === null ? "–" : `${a.total}%`}
            </p>
            {a.totalLevel && <p className="mt-1 font-semibold text-laut">Kategori {LEVEL_LABEL[a.totalLevel].toLowerCase()}</p>}
          </div>
          {a.dominant && (
            <p className="rounded-xl bg-laut-50 px-4 py-3 text-sm text-laut">
              Kelelahan Anda paling banyak bersumber dari dimensi <strong>{DIMENSIONS[a.dominant].label.toLowerCase()}</strong>.
              Rekomendasi di bawah difokuskan ke sana.
            </p>
          )}
        </div>
        <div className="card">
          <h2 className="text-base">Peta sumber burnout</h2>
          <RadarScore data={radar} />
        </div>
      </section>

      <section className="card">
        <h2 className="mb-4 text-base">Skor per dimensi</h2>
        <DimensionBars dimensions={a.dimensions} dominant={a.dominant} />
        <p className="mt-4 text-xs text-slate-500">
          Kategori: di bawah 50 rendah, 50–74 sedang, 75–99 tinggi, 100 sangat tinggi. Ambang ini mengikuti konvensi
          literatur CBI dan bersifat indikatif.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl">Rekomendasi untuk Anda</h2>
        <RecommendationList items={recommendations} />
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/checkin" className="btn-primary">Isi check-in hari ini</Link>
        <Link href="/riwayat" className="btn-secondary">Lihat riwayat</Link>
      </div>

      <Disclaimer />
    </div>
  );
}
