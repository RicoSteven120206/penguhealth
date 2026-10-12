import "server-only";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";
import { getSession } from "./auth";
import type { SessionPayload } from "./session";

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function zodError(err: ZodError) {
  return jsonError("Data tidak valid.", 422, err.flatten().fieldErrors);
}

/** Memastikan request berasal dari pengguna yang login dan sudah menyetujui penggunaan data. */
export async function requireApiSession(
  opts: { consent?: boolean } = { consent: true },
): Promise<{ session: SessionPayload } | { response: NextResponse }> {
  const session = await getSession();
  if (!session) return { response: jsonError("Silakan masuk terlebih dahulu.", 401) };
  if (opts.consent !== false && !session.consent) {
    return { response: jsonError("Setujui penggunaan data terlebih dahulu.", 403) };
  }
  return { session };
}
