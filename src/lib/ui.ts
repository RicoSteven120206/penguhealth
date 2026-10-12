import type { Level } from "./cbi";

/** Warna status sesuai Design Brief: hijau rendah, kuning sedang, merah tinggi. */
export const LEVEL_STYLE: Record<Level, { bg: string; text: string; bar: string; hex: string }> = {
  rendah: { bg: "bg-rendah/10", text: "text-rendah", bar: "bg-rendah", hex: "#2E9E6B" },
  sedang: { bg: "bg-sedang/15", text: "text-amber-700", bar: "bg-sedang", hex: "#F2B705" },
  tinggi: { bg: "bg-tinggi/10", text: "text-tinggi", bar: "bg-tinggi", hex: "#D9534F" },
  sangat_tinggi: { bg: "bg-tinggi/15", text: "text-tinggi", bar: "bg-tinggi", hex: "#D9534F" },
};

export function formatDate(d: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
}

export function formatShortDate(d: Date | string): string {
  return new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" }).format(new Date(d));
}

/** Tanggal hari ini (YYYY-MM-DD) di zona waktu perangkat pengguna. */
export function todayLocal(): string {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}
