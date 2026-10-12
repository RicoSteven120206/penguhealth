import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDb } from "./db";
import { Assessment } from "@/models/Assessment";
import { CheckIn } from "@/models/CheckIn";
import { User } from "@/models/User";
import type { DimensionKey, Level } from "./cbi";

/** Bentuk data polos (aman dikirim ke komponen klien). */
export interface AssessmentView {
  id: string;
  createdAt: string;
  total: number | null;
  totalLevel: Level | null;
  dominant: DimensionKey | null;
  needsReferral: boolean;
  dimensions: Record<DimensionKey, { score: number | null; level: Level | null }>;
}

export interface CheckInView {
  id: string;
  day: string;
  mood: number;
  energy: number;
  sleepHours: number;
  deadlines: number;
  note: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toAssessmentView(doc: any): AssessmentView {
  const dim = (k: DimensionKey) => ({
    score: doc.dimensions?.[k]?.score ?? null,
    level: doc.dimensions?.[k]?.level ?? null,
  });
  return {
    id: String(doc._id),
    createdAt: new Date(doc.createdAt).toISOString(),
    total: doc.total ?? null,
    totalLevel: doc.totalLevel ?? null,
    dominant: doc.dominant ?? null,
    needsReferral: Boolean(doc.needsReferral),
    dimensions: { personal: dim("personal"), studi: dim("studi"), teman: dim("teman"), dosen: dim("dosen") },
  };
}

export async function getAssessment(userId: string, id: string): Promise<AssessmentView | null> {
  if (!isValidObjectId(id)) return null;
  await connectDb();
  const doc = await Assessment.findOne({ _id: id, userId }).select("-answers").lean();
  return doc ? toAssessmentView(doc) : null;
}

/** Asesmen milik pengguna, terlama ke terbaru. */
export async function listAssessments(userId: string, limit = 24): Promise<AssessmentView[]> {
  await connectDb();
  const docs = await Assessment.find({ userId }).select("-answers").sort({ createdAt: -1 }).limit(limit).lean();
  return docs.map(toAssessmentView).reverse();
}

/** Check-in 30 hari terakhir, terlama ke terbaru. */
export async function listCheckIns(userId: string, limit = 30): Promise<CheckInView[]> {
  await connectDb();
  const docs = await CheckIn.find({ userId }).sort({ day: -1 }).limit(limit).lean();
  return docs
    .map((d) => ({
      id: String(d._id),
      day: d.day,
      mood: d.mood,
      energy: d.energy,
      sleepHours: d.sleepHours,
      deadlines: d.deadlines,
      note: d.note ?? "",
    }))
    .reverse();
}

export async function getProfile(userId: string) {
  await connectDb();
  const u = await User.findById(userId).select("name email university semester consentAt createdAt").lean();
  if (!u) return null;
  return {
    name: u.name,
    email: u.email,
    university: u.university ?? "",
    semester: u.semester ?? null,
    consentAt: u.consentAt ? new Date(u.consentAt).toISOString() : null,
    createdAt: new Date(u.createdAt as unknown as Date).toISOString(),
  };
}
