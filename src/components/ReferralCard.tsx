import { COUNSELING } from "@/lib/counseling";

/** Kartu rujukan: ditampilkan PALING ATAS bila ada dimensi berkategori tinggi. */
export function ReferralCard() {
  return (
    <section className="rounded-2xl border-2 border-tinggi/40 bg-tinggi/5 p-6" aria-labelledby="rujukan-judul">
      <h2 id="rujukan-judul" className="text-lg !text-tinggi">Kami sarankan Anda berbicara dengan konselor</h2>
      <p className="mt-2 text-sm text-slate-700">
        Hasil Anda menunjukkan tingkat burnout yang tinggi pada setidaknya satu dimensi. Ini bukan diagnosis, tetapi
        tanda bahwa Anda layak mendapat dukungan dari profesional. Berbicara dengan konselor adalah langkah yang kuat,
        bukan tanda kelemahan.
      </p>
      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div>
          <dt className="muted">Layanan</dt>
          <dd className="font-semibold text-laut">{COUNSELING.name}</dd>
        </div>
        <div>
          <dt className="muted">Kontak</dt>
          <dd className="font-semibold text-laut">{COUNSELING.contact}</dd>
        </div>
        {COUNSELING.schedule && (
          <div>
            <dt className="muted">Jadwal</dt>
            <dd className="font-semibold text-laut">{COUNSELING.schedule}</dd>
          </div>
        )}
      </dl>
      <p className="mt-4 text-xs text-slate-600">
        Dalam keadaan darurat atau jika muncul pikiran untuk menyakiti diri sendiri, segera hubungi 112.
      </p>
    </section>
  );
}
