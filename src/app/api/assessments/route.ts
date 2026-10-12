import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Assessment } from "@/models/Assessment";
import { assessmentSchema } from "@/lib/validation";
import { requireApiSession, zodError } from "@/lib/api";
import { scoreCbi } from "@/lib/cbi";

/** Menyimpan asesmen baru. Skor SELALU dihitung ulang di server dari jawaban mentah. */
export async function POST(req: Request) {
  const auth = await requireApiSession();
  if ("response" in auth) return auth.response;

  const parsed = assessmentSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodError(parsed.error);

  const answers: Record<number, number> = {};
  for (const [k, v] of Object.entries(parsed.data.answers)) answers[Number(k)] = v;
  const result = scoreCbi(answers);

  await connectDb();
  const doc = await Assessment.create({
    userId: auth.session.sub,
    answers: parsed.data.answers,
    dimensions: result.dimensions,
    total: result.total,
    totalLevel: result.totalLevel,
    dominant: result.dominant,
    needsReferral: result.needsReferral,
  });

  return NextResponse.json({ ok: true, id: String(doc._id), next: `/hasil/${doc._id}` }, { status: 201 });
}

/** Daftar asesmen milik pengguna, terbaru dulu (tanpa jawaban mentah). */
export async function GET() {
  const auth = await requireApiSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const items = await Assessment.find({ userId: auth.session.sub })
    .select("-answers")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({ items });
}
