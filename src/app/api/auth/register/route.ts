import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDb } from "@/lib/db";
import { User } from "@/models/User";
import { registerSchema } from "@/lib/validation";
import { jsonError, zodError } from "@/lib/api";
import { setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json().catch(() => ({})));
  if (!parsed.success) return zodError(parsed.error);

  const { name, email, password, university, semester } = parsed.data;
  await connectDb();

  const exists = await User.exists({ email });
  if (exists) return jsonError("Email sudah terdaftar.", 409);

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    passwordHash,
    university: university || undefined,
    semester,
  });

  await setSessionCookie({ sub: String(user._id), name: user.name, consent: false });
  return NextResponse.json({ ok: true, next: "/persetujuan" }, { status: 201 });
}
