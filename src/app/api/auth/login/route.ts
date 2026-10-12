import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { loginSchema } from "@/lib/validation";
import { jsonError, zodError } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodError(parsed.error);

  await connectDb();
  const user = await User.findOne({ email: parsed.data.email });
  const ok = user && (await bcrypt.compare(parsed.data.password, user.passwordHash));
  if (!user || !ok) return jsonError("Email atau kata sandi salah.", 401);

  const consent = Boolean(user.consentAt);
  await setSessionCookie({ sub: String(user._id), name: user.name, consent });
  return NextResponse.json({ ok: true, next: consent ? "/dashboard" : "/persetujuan" });
}
