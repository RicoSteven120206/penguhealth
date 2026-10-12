import { z } from "zod";
import { CBI_ITEMS, VALID_VALUES } from "./cbi";

export const registerSchema = z.object({
  name: z.string().trim().min(2, "Nama minimal 2 karakter").max(80),
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(8, "Kata sandi minimal 8 karakter").max(100),
  university: z.string().trim().max(120).optional().or(z.literal("")),
  semester: z.coerce.number().int().min(1).max(14).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email tidak valid"),
  password: z.string().min(1, "Kata sandi wajib diisi"),
});

const itemIds = new Set(CBI_ITEMS.map((i) => String(i.id)));

export const assessmentSchema = z.object({
  answers: z
    .record(z.string(), z.number())
    .refine((a) => Object.keys(a).every((k) => itemIds.has(k)), "Ada butir yang tidak dikenal")
    .refine(
      (a) => Object.values(a).every((v) => (VALID_VALUES as readonly number[]).includes(v)),
      "Nilai jawaban harus 0, 25, 50, 75, atau 100",
    )
    .refine((a) => Object.keys(a).length === CBI_ITEMS.length, "Semua 25 butir wajib dijawab"),
});

export const checkInSchema = z.object({
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal YYYY-MM-DD"),
  mood: z.coerce.number().int().min(1).max(5),
  energy: z.coerce.number().int().min(1).max(5),
  sleepHours: z.coerce.number().min(0).max(24),
  deadlines: z.coerce.number().int().min(0).max(50),
  note: z.string().max(500).optional().default(""),
});
