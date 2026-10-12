"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

type Mode = "daftar" | "masuk";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});

    const form = new FormData(e.currentTarget);
    const body = Object.fromEntries(form.entries());
    if (body.semester === "") delete body.semester;

    const res = await fetch(`/api/auth/${mode === "daftar" ? "register" : "login"}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);

    if (!res.ok) {
      setError(data.error ?? "Terjadi kesalahan. Coba lagi.");
      setFieldErrors(data.details ?? {});
      return;
    }

    const lanjut = params.get("lanjut");
    router.push(data.next === "/dashboard" && lanjut?.startsWith("/") ? lanjut : data.next);
    router.refresh();
  }

  const fe = (name: string) => fieldErrors[name]?.[0];

  return (
    <form onSubmit={onSubmit} className="card mx-auto max-w-md space-y-4" noValidate>
      <h1 className="text-2xl">{mode === "daftar" ? "Buat akun" : "Masuk"}</h1>

      {mode === "daftar" && (
        <div>
          <label className="label" htmlFor="name">Nama</label>
          <input className="input" id="name" name="name" autoComplete="name" required />
          {fe("name") && <p className="mt-1 text-xs text-tinggi">{fe("name")}</p>}
        </div>
      )}

      <div>
        <label className="label" htmlFor="email">Email</label>
        <input className="input" id="email" name="email" type="email" autoComplete="email" required />
        {fe("email") && <p className="mt-1 text-xs text-tinggi">{fe("email")}</p>}
      </div>

      <div>
        <label className="label" htmlFor="password">Kata sandi</label>
        <input
          className="input"
          id="password"
          name="password"
          type="password"
          autoComplete={mode === "daftar" ? "new-password" : "current-password"}
          required
        />
        {fe("password") && <p className="mt-1 text-xs text-tinggi">{fe("password")}</p>}
      </div>

      {mode === "daftar" && (
        <div className="grid grid-cols-[1fr_7rem] gap-3">
          <div>
            <label className="label" htmlFor="university">Kampus (opsional)</label>
            <input className="input" id="university" name="university" />
          </div>
          <div>
            <label className="label" htmlFor="semester">Semester</label>
            <input className="input" id="semester" name="semester" type="number" min={1} max={14} />
          </div>
        </div>
      )}

      {error && <p className="rounded-lg bg-tinggi/10 px-3 py-2 text-sm text-tinggi" role="alert">{error}</p>}

      <button type="submit" className="btn-primary w-full" disabled={busy}>
        {busy ? "Memproses…" : mode === "daftar" ? "Daftar" : "Masuk"}
      </button>

      <p className="text-center text-sm text-slate-600">
        {mode === "daftar" ? (
          <>Sudah punya akun? <Link href="/masuk" className="font-semibold text-laut underline">Masuk</Link></>
        ) : (
          <>Belum punya akun? <Link href="/daftar" className="font-semibold text-laut underline">Daftar</Link></>
        )}
      </p>
    </form>
  );
}
