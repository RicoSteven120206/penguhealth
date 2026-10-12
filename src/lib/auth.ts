import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, sessionCookieOptions, signSession, verifySession, type SessionPayload } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

/** Untuk halaman: arahkan ke /masuk bila belum login, ke /persetujuan bila belum menyetujui. */
export async function requireSession(opts: { consent?: boolean } = { consent: true }): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/masuk");
  if (opts.consent !== false && !session.consent) redirect("/persetujuan");
  return session;
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await signSession(payload);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
