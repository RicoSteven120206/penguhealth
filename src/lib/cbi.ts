/**
 * Copenhagen Burnout Inventory – Student Version (CBI-SV)
 *
 * 25 butir dalam 4 dimensi (Kristensen dkk., 2005; Campos dkk., 2013):
 *   personal (6), studi (7), teman kuliah (6), dosen (6).
 * Setiap jawaban bernilai 100, 75, 50, 25, atau 0.
 * Skor dimensi = rata-rata butirnya (skala 0–100, langsung dibaca sebagai persen).
 *
 * Catatan: terjemahan butir disusun tim dan perlu uji keterbacaan sebelum dipakai luas.
 */

export type DimensionKey = "personal" | "studi" | "teman" | "dosen";
export type ResponseFormat = "frekuensi" | "intensitas";
export type Level = "rendah" | "sedang" | "tinggi" | "sangat_tinggi";

export interface CbiItem {
  id: number;
  dimension: DimensionKey;
  text: string;
  format: ResponseFormat;
  reverse: boolean;
}

export const DIMENSIONS: Record<DimensionKey, { label: string; description: string }> = {
  personal: {
    label: "Personal",
    description: "Kelelahan fisik dan psikologis secara umum.",
  },
  studi: {
    label: "Studi",
    description: "Kelelahan yang dikaitkan dengan kuliah, tugas, dan belajar.",
  },
  teman: {
    label: "Teman kuliah",
    description: "Kelelahan dari interaksi dan kerja sama dengan sesama mahasiswa.",
  },
  dosen: {
    label: "Dosen",
    description: "Kelelahan dari hubungan dan komunikasi dengan dosen.",
  },
};

export const DIMENSION_ORDER: DimensionKey[] = ["personal", "studi", "teman", "dosen"];

export const CBI_ITEMS: CbiItem[] = [
  // Personal
  { id: 1, dimension: "personal", format: "frekuensi", reverse: false, text: "Seberapa sering Anda merasa lelah?" },
  { id: 2, dimension: "personal", format: "frekuensi", reverse: false, text: "Seberapa sering Anda merasa lelah secara fisik?" },
  { id: 3, dimension: "personal", format: "frekuensi", reverse: false, text: "Seberapa sering Anda merasa lelah secara emosional?" },
  { id: 4, dimension: "personal", format: "frekuensi", reverse: false, text: "Seberapa sering Anda berpikir, \"Saya tidak sanggup lagi\"?" },
  { id: 5, dimension: "personal", format: "frekuensi", reverse: false, text: "Seberapa sering Anda merasa terkuras?" },
  { id: 6, dimension: "personal", format: "frekuensi", reverse: false, text: "Seberapa sering Anda merasa lemah dan mudah sakit?" },
  // Studi
  { id: 7, dimension: "studi", format: "intensitas", reverse: false, text: "Apakah kuliah Anda menguras emosi?" },
  { id: 8, dimension: "studi", format: "intensitas", reverse: false, text: "Apakah Anda merasa burnout karena kuliah?" },
  { id: 9, dimension: "studi", format: "intensitas", reverse: false, text: "Apakah kuliah membuat Anda frustrasi?" },
  { id: 10, dimension: "studi", format: "frekuensi", reverse: false, text: "Apakah Anda merasa terkuras di akhir hari perkuliahan?" },
  { id: 11, dimension: "studi", format: "frekuensi", reverse: false, text: "Apakah Anda sudah lelah di pagi hari saat memikirkan satu hari lagi di kampus?" },
  { id: 12, dimension: "studi", format: "frekuensi", reverse: false, text: "Apakah Anda merasa setiap jam kuliah atau belajar melelahkan?" },
  { id: 13, dimension: "studi", format: "frekuensi", reverse: true, text: "Apakah Anda masih punya energi untuk keluarga dan teman di waktu luang?" },
  // Teman kuliah
  { id: 14, dimension: "teman", format: "intensitas", reverse: false, text: "Apakah Anda merasa sulit bekerja sama dengan teman kuliah?" },
  { id: 15, dimension: "teman", format: "intensitas", reverse: false, text: "Apakah bekerja dengan teman kuliah membuat Anda frustrasi?" },
  { id: 16, dimension: "teman", format: "intensitas", reverse: false, text: "Apakah bekerja dengan teman kuliah menguras energi Anda?" },
  { id: 17, dimension: "teman", format: "intensitas", reverse: false, text: "Apakah Anda merasa memberi lebih banyak daripada yang Anda terima saat bekerja dengan teman kuliah?" },
  { id: 18, dimension: "teman", format: "frekuensi", reverse: false, text: "Apakah Anda lelah bekerja dengan teman kuliah?" },
  { id: 19, dimension: "teman", format: "frekuensi", reverse: false, text: "Apakah Anda kadang bertanya-tanya berapa lama lagi sanggup bekerja dengan teman kuliah?" },
  // Dosen
  { id: 20, dimension: "dosen", format: "intensitas", reverse: false, text: "Apakah Anda merasa sulit bekerja dengan dosen?" },
  { id: 21, dimension: "dosen", format: "intensitas", reverse: false, text: "Apakah berurusan dengan dosen membuat Anda frustrasi?" },
  { id: 22, dimension: "dosen", format: "intensitas", reverse: false, text: "Apakah berurusan dengan dosen menguras energi Anda?" },
  { id: 23, dimension: "dosen", format: "intensitas", reverse: false, text: "Apakah Anda merasa memberi lebih banyak daripada yang Anda terima dari dosen?" },
  { id: 24, dimension: "dosen", format: "frekuensi", reverse: false, text: "Apakah Anda lelah berurusan dengan dosen?" },
  { id: 25, dimension: "dosen", format: "frekuensi", reverse: false, text: "Apakah Anda kadang bertanya-tanya berapa lama lagi sanggup berurusan dengan dosen?" },
];

/** Pilihan jawaban; `value` adalah nilai mentah sebelum pembalikan item terbalik. */
export const RESPONSE_OPTIONS: Record<ResponseFormat, { label: string; value: number }[]> = {
  frekuensi: [
    { label: "Selalu", value: 100 },
    { label: "Sering", value: 75 },
    { label: "Kadang-kadang", value: 50 },
    { label: "Jarang", value: 25 },
    { label: "Tidak pernah / hampir tidak pernah", value: 0 },
  ],
  intensitas: [
    { label: "Sangat tinggi", value: 100 },
    { label: "Tinggi", value: 75 },
    { label: "Sedang", value: 50 },
    { label: "Rendah", value: 25 },
    { label: "Sangat rendah", value: 0 },
  ],
};

export const VALID_VALUES = [0, 25, 50, 75, 100] as const;

/** Jawaban: id butir -> nilai mentah (0/25/50/75/100). */
export type Answers = Record<number, number>;

export interface DimensionScore {
  dimension: DimensionKey;
  score: number | null; // null jika butir terjawab < 50%
  level: Level | null;
  answered: number;
  total: number;
}

export interface ScoreResult {
  dimensions: Record<DimensionKey, DimensionScore>;
  total: number | null;
  totalLevel: Level | null;
  dominant: DimensionKey | null;
  needsReferral: boolean;
}

/**
 * Kategori mengikuti konvensi yang umum dipakai dalam literatur CBI:
 * < 50 rendah, 50–74 sedang, 75–99 tinggi, 100 sangat tinggi.
 * Bersifat indikatif, bukan diagnosis.
 */
export function classify(score: number): Level {
  if (score >= 100) return "sangat_tinggi";
  if (score >= 75) return "tinggi";
  if (score >= 50) return "sedang";
  return "rendah";
}

export const LEVEL_LABEL: Record<Level, string> = {
  rendah: "Rendah",
  sedang: "Sedang",
  tinggi: "Tinggi",
  sangat_tinggi: "Sangat tinggi",
};

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

/** Nilai yang dipakai untuk skor setelah pembalikan item terbalik. */
export function scoredValue(item: CbiItem, raw: number): number {
  return item.reverse ? 100 - raw : raw;
}

export function isValidAnswer(raw: unknown): raw is number {
  return typeof raw === "number" && (VALID_VALUES as readonly number[]).includes(raw);
}

/**
 * Menghitung skor CBI-SV.
 * - Butir dengan jawaban tidak valid diabaikan.
 * - Skor dimensi hanya dihitung jika minimal 50% butirnya terjawab.
 * - Skor total = rata-rata skor dimensi yang tersedia.
 * - Rujukan diperlukan jika ada dimensi berkategori tinggi atau sangat tinggi.
 */
export function scoreCbi(answers: Answers): ScoreResult {
  const dimensions = {} as Record<DimensionKey, DimensionScore>;

  for (const dim of DIMENSION_ORDER) {
    const items = CBI_ITEMS.filter((i) => i.dimension === dim);
    const values: number[] = [];
    for (const item of items) {
      const raw = answers[item.id];
      if (isValidAnswer(raw)) values.push(scoredValue(item, raw));
    }
    const enough = values.length >= Math.ceil(items.length / 2);
    const score = enough ? round1(values.reduce((a, b) => a + b, 0) / values.length) : null;
    dimensions[dim] = {
      dimension: dim,
      score,
      level: score === null ? null : classify(score),
      answered: values.length,
      total: items.length,
    };
  }

  const available = DIMENSION_ORDER.map((d) => dimensions[d]).filter((d) => d.score !== null);
  const total = available.length
    ? round1(available.reduce((a, d) => a + (d.score as number), 0) / available.length)
    : null;

  let dominant: DimensionKey | null = null;
  for (const d of available) {
    if (dominant === null || (d.score as number) > (dimensions[dominant].score as number)) {
      dominant = d.dimension;
    }
  }

  const needsReferral = available.some((d) => d.level === "tinggi" || d.level === "sangat_tinggi");

  return {
    dimensions,
    total,
    totalLevel: total === null ? null : classify(total),
    dominant,
    needsReferral,
  };
}
