import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { jsonError, requireApiSession, zodError } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";

const schema = z.object({
  agree: z.literal(true, { errorMap: () => ({ message: "Persetujuan wajib dicentang" }) }),
});

export async function POST(req: Request) {
  const auth = await requireApiSession({ consent: false });
  if ("response" in auth) return auth.response;

  const parsed = schema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodError(parsed.error);

  await connectDb();
  const user = await User.findByIdAndUpdate(auth.session.sub, { consentAt: new Date() }, { new: true });
  if (!user) return jsonError("Akun tidak ditemukan.", 404);

  await setSessionCookie({ sub: auth.session.sub, name: user.name, consent: true });
  return NextResponse.json({ ok: true, next: "/asesmen" });
}
