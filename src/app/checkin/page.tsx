import { requireSession } from "@/lib/auth";
import { CheckInForm } from "@/components/forms/CheckInForm";

export const metadata = { title: "Check-in harian – PenguHealth" };

export default async function CheckInPage() {
  await requireSession();
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl">Check-in harian</h1>
        <p className="muted mt-1">Kurang dari satu menit. Mengisi ulang di hari yang sama akan memperbarui data hari ini.</p>
      </div>
      <CheckInForm />
    </div>
  );
}
