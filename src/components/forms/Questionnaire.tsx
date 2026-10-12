"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CBI_ITEMS, DIMENSIONS, DIMENSION_ORDER, RESPONSE_OPTIONS, type Answers } from "@/lib/cbi";

const DRAFT_KEY = "penguhealth:asesmen-draft";

/** Kuesioner CBI-SV dibagi menjadi 4 langkah, satu langkah per dimensi. */
export function Questionnaire() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simpan draf di perangkat agar jawaban tidak hilang saat halaman tertutup.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(DRAFT_KEY);
      if (saved) setAnswers(JSON.parse(saved));
    } catch {
      /* penyimpanan tidak tersedia */
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(answers));
    } catch {
      /* penyimpanan tidak tersedia */
    }
  }, [answers]);

  const dimension = DIMENSION_ORDER[step];
  const items = useMemo(() => CBI_ITEMS.filter((i) => i.dimension === dimension), [dimension]);
  const answeredCount = Object.keys(answers).length;
  const stepComplete = items.every((i) => answers[i.id] !== undefined);
  const isLast = step === DIMENSION_ORDER.length - 1;

  function choose(id: number, value: number) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  async function submit() {
    setBusy(true);
    setError(null);
    const res = await fetch("/api/assessments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(data.error ?? "Gagal menyimpan asesmen.");
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* abaikan */
    }
    router.push(data.next);
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-laut">
            Bagian {step + 1} dari {DIMENSION_ORDER.length}: {DIMENSIONS[dimension].label}
          </span>
          <span className="muted">{answeredCount}/{CBI_ITEMS.length} terjawab</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-laut-50">
          <div className="h-full rounded-full bg-es transition-all" style={{ width: `${(answeredCount / CBI_ITEMS.length) * 100}%` }} />
        </div>
        <p className="muted mt-2">{DIMENSIONS[dimension].description}</p>
      </div>

      <ol className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="card">
            <fieldset>
              <legend className="font-medium text-laut-900">
                <span className="mr-2 text-slate-400">{item.id}.</span>
                {item.text}
              </legend>
              <div className="mt-3 grid gap-2 sm:grid-cols-5">
                {RESPONSE_OPTIONS[item.format].map((opt) => {
                  const selected = answers[item.id] === opt.value;
                  return (
                    <label
                      key={opt.value}
                      className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-sm transition ${
                        selected ? "border-laut bg-laut text-white" : "border-laut-100 bg-white hover:bg-laut-50"
                      }`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        name={`q${item.id}`}
                        value={opt.value}
                        checked={selected}
                        onChange={() => choose(item.id, opt.value)}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      {error && <p className="rounded-lg bg-tinggi/10 px-3 py-2 text-sm text-tinggi" role="alert">{error}</p>}

      <div className="flex justify-between gap-3">
        <button className="btn-secondary" onClick={() => setStep((s) => s - 1)} disabled={step === 0 || busy}>
          Sebelumnya
        </button>
        {isLast ? (
          <button className="btn-primary" onClick={submit} disabled={!stepComplete || answeredCount < CBI_ITEMS.length || busy}>
            {busy ? "Menghitung…" : "Lihat hasil"}
          </button>
        ) : (
          <button
            className="btn-primary"
            onClick={() => {
              setStep((s) => s + 1);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            disabled={!stepComplete}
          >
            Lanjut
          </button>
        )}
      </div>
    </div>
  );
}
