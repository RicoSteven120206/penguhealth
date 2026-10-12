import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { Assessment } from "@/models/Assessment";
import { CheckIn } from "@/models/CheckIn";
import { requireApiSession } from "@/lib/api";
import { clearSessionCookie } from "@/lib/auth";

/**
 * Menghapus akun beserta seluruh datanya (hak penghapusan data pribadi,
 * sejalan dengan UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi).
 */
export async function DELETE() {
  const auth = await requireApiSession({ consent: false });
  if ("response" in auth) return auth.response;

  await connectDb();
  const userId = auth.session.sub;
  await Promise.all([
    Assessment.deleteMany({ userId }),
    CheckIn.deleteMany({ userId }),
    User.deleteOne({ _id: userId }),
  ]);
  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}
