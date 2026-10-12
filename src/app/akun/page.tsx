import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth";
import { getProfile } from "@/lib/queries";
import { formatDate } from "@/lib/ui";
import { DeleteAccount } from "@/components/forms/DeleteAccount";

export const metadata = { title: "Akun – PenguHealth" };

export default async function AkunPage() {
  const session = await requireSession({ consent: false });
  const profile = await getProfile(session.sub);
  if (!profile) redirect("/masuk");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl">Akun</h1>

      <section className="card">
        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div><dt className="muted">Nama</dt><dd className="font-semibold">{profile.name}</dd></div>
          <div><dt className="muted">Email</dt><dd className="font-semibold">{profile.email}</dd></div>
          <div><dt className="muted">Kampus</dt><dd className="font-semibold">{profile.university || "–"}</dd></div>
          <div><dt className="muted">Semester</dt><dd className="font-semibold">{profile.semester ?? "–"}</dd></div>
          <div><dt className="muted">Terdaftar</dt><dd className="font-semibold">{formatDate(profile.createdAt)}</dd></div>
          <div>
            <dt className="muted">Persetujuan data</dt>
            <dd className="font-semibold">{profile.consentAt ? formatDate(profile.consentAt) : "Belum disetujui"}</dd>
          </div>
        </dl>
      </section>

      <section className="card border-tinggi/30">
        <h2 className="mb-2 text-base !text-tinggi">Hapus akun</h2>
        <DeleteAccount />
      </section>
    </div>
  );
}
