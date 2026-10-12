"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { todayLocal } from "@/lib/ui";

const SCALE = [1, 2, 3, 4, 5];
const MOOD_LABEL = ["Sangat buruk", "Buruk", "Biasa", "Baik", "Sangat baik"];
const ENERGY_LABEL = ["Habis", "Rendah", "Cukup", "Baik", "Penuh"];

function ScalePicker({
  name,
  label,
  hints,
  value,
  onChange,
}: {
  name: string;
  label: string;
  hints: string[];
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <fieldset>
      <legend className="label">{label}</legend>
      <div className="grid grid-cols-5 gap-2">
        {SCALE.map((v) => (
          <label
            key={v}
            className={`cursor-pointer rounded-xl border px-2 py-2 text-center text-xs transition ${
              value === v ? "border-laut bg-laut text-white" : "border-laut-100 bg-white hover:bg-laut-50"
            }`}
          >
            <input type="radio" name={name} value={v} className="sr-only" checked={value === v} onChange={() => onChange(v)} />
            <span className="block font-judul text-base font-semibold">{v}</span>
            {hints[v - 1]}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CheckInForm() {
  const router = useRouter();
  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/checkins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        day: todayLocal(),
        mood,
        energy,
        sleepHours: Number(form.get("sleepHours")),
        deadlines: Number(form.get("deadlines")),
        note: String(form.get("note") ?? ""),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMessage({ ok: false, text: data.error ?? "Gagal menyimpan check-in." });
    setMessage({ ok: true, text: "Check-in hari ini tersimpan. Terima kasih sudah meluangkan waktu." });
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5">
      <ScalePicker name="mood" label="Bagaimana suasana hati Anda hari ini?" hints={MOOD_LABEL} value={mood} onChange={setMood} />
      <ScalePicker name="energy" label="Seberapa besar energi Anda hari ini?" hints={ENERGY_LABEL} value={energy} onChange={setEnergy} />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="sleepHours">Jam tidur semalam</label>
          <input className="input" id="sleepHours" name="sleepHours" type="number" min={0} max={24} step={0.5} defaultValue={7} required />
        </div>
        <div>
          <label className="label" htmlFor="deadlines">Jumlah tenggat minggu ini</label>
          <input className="input" id="deadlines" name="deadlines" type="number" min={0} max={50} defaultValue={0} required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="note">Catatan (opsional)</label>
        <textarea className="input min-h-20" id="note" name="note" maxLength={500} placeholder="Apa yang paling memengaruhi hari Anda?" />
      </div>

      {message && (
        <p className={`rounded-lg px-3 py-2 text-sm ${message.ok ? "bg-rendah/10 text-rendah" : "bg-tinggi/10 text-tinggi"}`} role="status">
          {message.text}
        </p>
      )}

      <button className="btn-primary" disabled={busy}>{busy ? "Menyimpan…" : "Simpan check-in"}</button>
    </form>
  );
}
