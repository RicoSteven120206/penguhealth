"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteAccount() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function remove() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/account", { method: "DELETE" });
    setBusy(false);
    if (!res.ok) return setError("Gagal menghapus akun. Coba lagi.");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-slate-700">
        Menghapus akun akan menghapus permanen seluruh asesmen dan check-in Anda. Tindakan ini tidak dapat dibatalkan.
        Ketik <strong>HAPUS</strong> untuk mengonfirmasi.
      </p>
      <input className="input max-w-xs" value={confirmText} onChange={(e) => setConfirmText(e.target.value)} aria-label="Konfirmasi hapus" />
      {error && <p className="text-sm text-tinggi">{error}</p>}
      <div>
        <button className="btn-danger" disabled={confirmText !== "HAPUS" || busy} onClick={remove}>
          {busy ? "Menghapus…" : "Hapus akun dan semua data"}
        </button>
      </div>
    </div>
  );
}
