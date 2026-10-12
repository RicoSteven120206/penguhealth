import type { DimensionKey, Level, ScoreResult } from "./cbi";
import { DIMENSION_ORDER } from "./cbi";

/**
 * Rekomendasi berbasis aturan (rule-based).
 * Aturan keselamatan selalu didahulukan: hasil tinggi -> rujukan konseling.
 * Isi rekomendasi bersifat edukatif dan preventif, bukan terapi.
 */

export interface Recommendation {
  id: string;
  dimension: DimensionKey | "umum";
  title: string;
  steps: string[];
}

const BY_DIMENSION: Record<DimensionKey, Recommendation[]> = {
  personal: [
    {
      id: "tidur",
      dimension: "personal",
      title: "Pulihkan pola tidur",
      steps: [
        "Tetapkan jam tidur dan bangun yang sama, termasuk akhir pekan.",
        "Jauhkan layar 30 menit sebelum tidur.",
        "Batasi kafein setelah pukul 15.00.",
      ],
    },
    {
      id: "istirahat",
      dimension: "personal",
      title: "Sisipkan jeda pemulihan",
      steps: [
        "Ambil jeda 5–10 menit setiap 60–90 menit aktivitas.",
        "Lakukan aktivitas fisik ringan seperti jalan kaki 20–30 menit.",
        "Periksakan kesehatan jika sering merasa lemah atau mudah sakit.",
      ],
    },
  ],
  studi: [
    {
      id: "manajemen-tugas",
      dimension: "studi",
      title: "Pecah beban tugas",
      steps: [
        "Tulis semua tenggat minggu ini dalam satu daftar.",
        "Pecah tugas besar menjadi langkah kecil berdurasi 25–50 menit.",
        "Kerjakan dengan teknik Pomodoro: 25 menit fokus, 5 menit jeda.",
      ],
    },
    {
      id: "prioritas",
      dimension: "studi",
      title: "Atur prioritas dan batasan",
      steps: [
        "Tentukan tiga tugas terpenting setiap hari.",
        "Konsultasikan beban SKS atau kegiatan dengan dosen wali.",
        "Sisihkan satu waktu tanpa urusan kuliah setiap minggu.",
      ],
    },
  ],
  teman: [
    {
      id: "komunikasi-kelompok",
      dimension: "teman",
      title: "Perjelas kerja kelompok",
      steps: [
        "Sepakati pembagian peran dan tenggat di awal tugas kelompok.",
        "Sampaikan keberatan secara asertif: fakta, perasaan, permintaan.",
        "Catat kesepakatan di grup agar mudah ditagih bersama.",
      ],
    },
    {
      id: "batasan-sosial",
      dimension: "teman",
      title: "Jaga batasan sosial",
      steps: [
        "Belajar menolak permintaan yang melebihi kapasitas Anda.",
        "Cari satu atau dua teman yang suportif untuk berbagi cerita.",
      ],
    },
  ],
  dosen: [
    {
      id: "komunikasi-dosen",
      dimension: "dosen",
      title: "Perbaiki komunikasi dengan dosen",
      steps: [
        "Siapkan poin pertanyaan sebelum bimbingan atau konsultasi.",
        "Gunakan email yang singkat, sopan, dan jelas tujuannya.",
        "Catat masukan dosen dan tindak lanjutnya.",
      ],
    },
    {
      id: "dukungan-akademik",
      dimension: "dosen",
      title: "Manfaatkan dukungan akademik",
      steps: [
        "Hubungi dosen wali jika kesulitan dengan dosen tertentu.",
        "Gunakan layanan akademik fakultas untuk masalah administratif.",
      ],
    },
  ],
};

const MAINTENANCE: Recommendation = {
  id: "pemeliharaan",
  dimension: "umum",
  title: "Pertahankan kondisi baik",
  steps: [
    "Isi check-in harian untuk memantau perubahan sejak dini.",
    "Pertahankan rutinitas tidur, makan, dan olahraga.",
    "Ulangi asesmen dalam 2–4 minggu.",
  ],
};

const ORDER_WEIGHT: Record<Level, number> = { rendah: 0, sedang: 1, tinggi: 2, sangat_tinggi: 3 };

/**
 * Menghasilkan rekomendasi:
 * - Semua dimensi rendah -> rekomendasi pemeliharaan.
 * - Selain itu -> rekomendasi untuk setiap dimensi sedang ke atas,
 *   diurutkan dari skor tertinggi.
 */
export function buildRecommendations(result: ScoreResult): Recommendation[] {
  const elevated = DIMENSION_ORDER.map((d) => result.dimensions[d])
    .filter((d) => d.level !== null && ORDER_WEIGHT[d.level] >= 1)
    .sort((a, b) => (b.score as number) - (a.score as number));

  if (elevated.length === 0) return [MAINTENANCE];

  return elevated.flatMap((d) => BY_DIMENSION[d.dimension]);
}
