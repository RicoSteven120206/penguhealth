// Impor subpath agar hanya kode tanda tangan JWT (JWS) yang ikut ke middleware Edge.
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

/**
 * Token sesi (JWT) disimpan di cookie httpOnly.
 * File ini tidak mengimpor modul Node agar bisa dipakai di middleware (Edge runtime).
 */

export const SESSION_COOKIE = "ph_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 hari

export interface SessionPayload {
  sub: string; // id pengguna
  name: string;
  consent: boolean;
}

function secretKey(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET belum diatur atau kurang dari 32 karakter.");
  }
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ name: payload.name, consent: payload.consent })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (!payload.sub) return null;
    return {
      sub: payload.sub,
      name: String(payload.name ?? ""),
      consent: Boolean(payload.consent),
    };
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE_SECONDS,
};
