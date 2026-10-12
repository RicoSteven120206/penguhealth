import { requireSession } from "@/lib/auth";
import { Questionnaire } from "@/components/forms/Questionnaire";

export const metadata = { title: "Asesmen – PenguHealth" };

export default async function AsesmenPage() {
  await requireSession();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl">Asesmen burnout (CBI-SV)</h1>
        <p className="muted mt-1">
          Jawab berdasarkan kondisi Anda dalam beberapa minggu terakhir. Tidak ada jawaban benar atau salah.
        </p>
      </div>
      <Questionnaire />
    </div>
  );
}
