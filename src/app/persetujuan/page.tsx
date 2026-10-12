import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { ConsentForm } from "@/components/forms/ConsentForm";

export const metadata = { title: "Persetujuan – PenguHealth" };

export default async function PersetujuanPage() {
  const session = await requireSession({ consent: false });
  if (session.consent) redirect("/dashboard");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl">Sebelum mulai, mohon baca ini</h1>
        <p className="muted mt-1">Persetujuan penggunaan data (informed consent)</p>
      </div>

      <div className="card space-y-4 text-sm leading-relaxed text-slate-700">
        <section>
          <h2 className="text-base">Apa itu PenguHealth</h2>
          <p>
            PenguHealth adalah alat <strong>skrining mandiri</strong> burnout akademik berbasis Copenhagen Burnout
            Inventory – Student Version (CBI-SV). Hasilnya bersifat indikatif, <strong>bukan diagnosis</strong>, dan
            tidak menggantikan layanan psikolog atau psikiater.
          </p>
        </section>
        <section>
          <h2 className="text-base">Data yang kami simpan</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Profil akun: nama, email, kampus, dan semester.</li>
            <li>Jawaban kuesioner CBI-SV beserta skornya.</li>
            <li>Check-in harian: mood, energi, jam tidur, jumlah tenggat, dan catatan opsional.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base">Cara data digunakan</h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>Hanya untuk menampilkan hasil, rekomendasi, dan grafik perkembangan kepada Anda sendiri.</li>
            <li>Tidak dijual dan tidak dibagikan ke pihak lain, termasuk kampus, tanpa izin Anda.</li>
            <li>Anda dapat menghapus akun beserta seluruh datanya kapan saja dari halaman Akun.</li>
          </ul>
        </section>
        <section>
          <h2 className="text-base">Jika hasil Anda tinggi</h2>
          <p>
            Aplikasi akan menyarankan Anda menghubungi layanan konseling kampus. Keputusan untuk menghubunginya
            sepenuhnya ada pada Anda.
          </p>
        </section>
      </div>

      <ConsentForm />
    </div>
  );
}
