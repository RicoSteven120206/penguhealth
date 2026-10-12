/** Kontak layanan konseling kampus (diatur lewat variabel lingkungan). */
export const COUNSELING = {
  name: process.env.NEXT_PUBLIC_KONSELING_NAMA || "Layanan Konseling Kampus",
  contact: process.env.NEXT_PUBLIC_KONSELING_KONTAK || "Hubungi bagian kemahasiswaan kampus Anda",
  schedule: process.env.NEXT_PUBLIC_KONSELING_JADWAL || "",
};
