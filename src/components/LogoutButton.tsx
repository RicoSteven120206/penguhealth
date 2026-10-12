"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button onClick={logout} disabled={busy} className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-laut-50">
      Keluar
    </button>
  );
}
