import { describe, expect, it } from "vitest";
import { CBI_ITEMS, classify, scoreCbi, type Answers } from "@/lib/cbi";

function fillAll(value: number): Answers {
  return Object.fromEntries(CBI_ITEMS.map((i) => [i.id, value]));
}

describe("struktur CBI-SV", () => {
  it("memiliki 25 butir: personal 6, studi 7, teman 6, dosen 6", () => {
    const count = (d: string) => CBI_ITEMS.filter((i) => i.dimension === d).length;
    expect(CBI_ITEMS).toHaveLength(25);
    expect([count("personal"), count("studi"), count("teman"), count("dosen")]).toEqual([6, 7, 6, 6]);
  });

  it("hanya butir 13 yang dinilai terbalik", () => {
    expect(CBI_ITEMS.filter((i) => i.reverse).map((i) => i.id)).toEqual([13]);
  });
});

describe("classify", () => {
  it("mengikuti ambang 50 / 75 / 100", () => {
    expect(classify(0)).toBe("rendah");
    expect(classify(49.9)).toBe("rendah");
    expect(classify(50)).toBe("sedang");
    expect(classify(74.9)).toBe("sedang");
    expect(classify(75)).toBe("tinggi");
    expect(classify(99.9)).toBe("tinggi");
    expect(classify(100)).toBe("sangat_tinggi");
  });
});

describe("scoreCbi", () => {
  it("contoh dimensi studi Utza dari proposal: (75+50+75+100+75+75+75)/7 = 75", () => {
    // Butir 13 dijawab "Jarang" (25) -> setelah dibalik bernilai 75.
    const answers: Answers = { 7: 75, 8: 50, 9: 75, 10: 100, 11: 75, 12: 75, 13: 25 };
    const r = scoreCbi(answers);
    expect(r.dimensions.studi.score).toBe(75);
    expect(r.dimensions.studi.level).toBe("tinggi");
  });

  it("semua 0 -> rendah, kecuali butir terbalik yang menjadi 100", () => {
    const r = scoreCbi(fillAll(0));
    expect(r.dimensions.personal.score).toBe(0);
    expect(r.dimensions.studi.score).toBe(14.3); // 100/7
    expect(r.needsReferral).toBe(false);
  });

  it("semua 100 -> sangat tinggi dan perlu rujukan", () => {
    const r = scoreCbi(fillAll(100));
    expect(r.dimensions.personal.level).toBe("sangat_tinggi");
    expect(r.dimensions.studi.score).toBe(85.7); // (600+0)/7
    expect(r.needsReferral).toBe(true);
  });

  it("menentukan dimensi dominan", () => {
    const answers = fillAll(25);
    for (const i of CBI_ITEMS.filter((x) => x.dimension === "dosen")) answers[i.id] = 75;
    expect(scoreCbi(answers).dominant).toBe("dosen");
  });

  it("dimensi dengan jawaban < 50% tidak diberi skor", () => {
    const r = scoreCbi({ 1: 100, 2: 100 });
    expect(r.dimensions.personal.score).toBeNull();
    expect(r.total).toBeNull();
  });

  it("mengabaikan nilai jawaban yang tidak valid", () => {
    const answers = fillAll(50);
    answers[1] = 60;
    expect(scoreCbi(answers).dimensions.personal.answered).toBe(5);
  });

  it("rujukan dipicu oleh satu dimensi tinggi walau total sedang", () => {
    const answers = fillAll(25);
    for (const i of CBI_ITEMS.filter((x) => x.dimension === "personal")) answers[i.id] = 75;
    const r = scoreCbi(answers);
    expect(r.totalLevel).not.toBe("tinggi");
    expect(r.needsReferral).toBe(true);
  });
});
