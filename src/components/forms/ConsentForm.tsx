"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ConsentForm() {
  const router = useRouter();
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agree }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Gagal menyimpan persetujuan.");
    router.push(data.next);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <label className="flex items-start gap-3 rounded-xl border border-laut-100 bg-white p-4 text-sm">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 accent-laut"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
        />
        <span>
          Saya telah membaca dan memahami penjelasan di atas, dan saya setuju data saya diproses untuk keperluan
          skrining sesuai ketentuan tersebut.
        </span>
      </label>
      {error && <p className="text-sm text-tinggi" role="alert">{error}</p>}
      <button className="btn-primary" disabled={!agree || busy} onClick={submit}>
        {busy ? "Menyimpan…" : "Setuju dan lanjut ke asesmen"}
      </button>
    </div>
  );
}
