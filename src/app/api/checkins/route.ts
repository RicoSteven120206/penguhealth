import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { CheckIn } from "@/models/CheckIn";
import { checkInSchema } from "@/lib/validation";
import { requireApiSession, zodError } from "@/lib/api";

/** Menyimpan check-in harian. Jika hari itu sudah ada, datanya diperbarui. */
export async function POST(req: Request) {
  const auth = await requireApiSession();
  if ("response" in auth) return auth.response;

  const parsed = checkInSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodError(parsed.error);

  await connectDb();
  const { day, ...rest } = parsed.data;
  const doc = await CheckIn.findOneAndUpdate(
    { userId: auth.session.sub, day },
    { $set: rest, $setOnInsert: { userId: auth.session.sub, day } },
    { upsert: true, new: true },
  );

  return NextResponse.json({ ok: true, id: String(doc._id) });
}

/** Check-in 30 hari terakhir, urut dari terlama. */
export async function GET() {
  const auth = await requireApiSession();
  if ("response" in auth) return auth.response;

  await connectDb();
  const items = await CheckIn.find({ userId: auth.session.sub }).sort({ day: -1 }).limit(30).lean();
  return NextResponse.json({ items: items.reverse() });
}
