import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { Logo } from "@/components/Logo";
import { Disclaimer } from "@/components/Disclaimer";

const STEPS = [
  { title: "Isi 25 pertanyaan", body: "Kuesioner CBI-SV, sekitar 7 menit." },
  { title: "Lihat sumber burnout", body: "Skor pada empat dimensi: personal, studi, teman kuliah, dan dosen." },
  { title: "Dapat langkah konkret", body: "Rekomendasi sesuai dimensi tertinggi, dan rujukan bila hasil tinggi." },
  { title: "Pantau perkembangan", body: "Check-in harian 1 menit dan asesmen ulang tiap 2–4 minggu." },
];

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect(session.consent ? "/dashboard" : "/persetujuan");

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-es">Skrining burnout akademik</p>
          <h1 className="mt-2 text-3xl leading-tight md:text-4xl">
            Kenali lelahmu lebih awal, sebelum kuliah terasa terlalu berat.
          </h1>
          <p className="mt-4 text-slate-600">
            PenguHealth membantu mahasiswa mengukur tingkat burnout dan menemukan sumbernya, lalu memberi langkah
            pencegahan yang tepat. Gratis, mandiri, dan berbasis instrumen tervalidasi.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/daftar" className="btn-primary">Mulai skrining</Link>
            <Link href="/masuk" className="btn-secondary">Saya sudah punya akun</Link>
          </div>
        </div>
        <div className="card flex flex-col items-center justify-center gap-4 py-10 text-center">
          <Logo size={96} />
          <p className="max-w-xs text-sm text-slate-600">
            Seperti penguin yang bertahan bersama di cuaca keras, kamu tidak perlu menghadapi burnout sendirian.
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-xl">Cara kerja</h2>
        <ol className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="card">
              <span className="font-judul text-2xl font-semibold text-es">{i + 1}</span>
              <h3 className="mt-1 text-base">{s.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <Disclaimer />
    </div>
  );
}
