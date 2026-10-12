import { describe, expect, it } from "vitest";
import { CBI_ITEMS, scoreCbi, type Answers } from "@/lib/cbi";
import { buildRecommendations } from "@/lib/recommendations";
import { ewma, shouldReassess, summarizeTrend, wellbeingIndex } from "@/lib/trend";

function fillAll(value: number): Answers {
  return Object.fromEntries(CBI_ITEMS.map((i) => [i.id, value]));
}

describe("buildRecommendations", () => {
  it("semua rendah -> hanya rekomendasi pemeliharaan", () => {
    const recs = buildRecommendations(scoreCbi(fillAll(0)));
    expect(recs.map((r) => r.id)).toEqual(["pemeliharaan"]);
  });

  it("dimensi tertinggi muncul paling awal", () => {
    const answers = fillAll(0);
    for (const i of CBI_ITEMS.filter((x) => x.dimension === "studi")) answers[i.id] = 100;
    for (const i of CBI_ITEMS.filter((x) => x.dimension === "teman")) answers[i.id] = 50;
    const recs = buildRecommendations(scoreCbi(answers));
    expect(recs[0].dimension).toBe("studi");
    expect(recs.some((r) => r.dimension === "teman")).toBe(true);
    expect(recs.some((r) => r.dimension === "dosen")).toBe(false);
  });
});

describe("tren check-in", () => {
  it("indeks kesejahteraan 0–100", () => {
    expect(wellbeingIndex({ mood: 5, energy: 5, sleepHours: 8 })).toBe(100);
    expect(wellbeingIndex({ mood: 1, energy: 1, sleepHours: 2 })).toBe(0);
  });

  it("EWMA menghaluskan lonjakan", () => {
    expect(ewma([100, 0])).toEqual([100, 70]);
  });

  it("menandai tren menurun bila EWMA turun >= 10 poin dalam 7 check-in", () => {
    const days = Array.from({ length: 7 }, (_, i) => ({
      date: `2026-10-0${i + 1}`,
      mood: 5 - Math.min(i, 4),
      energy: 5 - Math.min(i, 4),
      sleepHours: 8,
    }));
    const t = summarizeTrend(days);
    expect(t.declining).toBe(true);
    expect(shouldReassess(new Date(), t).due).toBe(true);
  });

  it("menyarankan asesmen ulang setelah 14 hari", () => {
    const t = summarizeTrend([]);
    const now = new Date("2026-10-20");
    expect(shouldReassess(new Date("2026-10-01"), t, now).due).toBe(true);
    expect(shouldReassess(new Date("2026-10-15"), t, now).due).toBe(false);
  });
});
