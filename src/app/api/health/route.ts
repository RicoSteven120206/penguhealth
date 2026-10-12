import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Cek kesehatan setelah deploy: buka /api/health di browser.
 * Hanya melaporkan ADA/TIDAK-nya variabel, tidak pernah nilainya.
 */
export async function GET() {
  const env = {
    MONGODB_URI: Boolean(process.env.MONGODB_URI),
    AUTH_SECRET: (process.env.AUTH_SECRET?.length ?? 0) >= 32,
  };

  let database: "ok" | "error" = "error";
  let message: string | undefined;
  try {
    const conn = await connectDb();
    await conn.connection.db?.admin().ping();
    database = "ok";
  } catch (err) {
    const name = err instanceof Error ? err.name : "Error";
    const raw = err instanceof Error ? err.message : "";
    message = /querySrv|querytxt/i.test(raw)
      ? "Gagal mencari alamat cluster (DNS SRV). Umumnya bug Node.js di Windows: isi MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 di .env.local lalu restart, atau perbarui Node.js ke versi LTS terbaru."
      : name === "MongooseServerSelectionError"
        ? "Tidak bisa menjangkau MongoDB. Cek Network Access di Atlas (0.0.0.0/0) dan connection string."
        : name === "MongoServerError"
          ? "Ditolak MongoDB. Cek username dan password database di connection string."
          : err instanceof Error
            ? err.message
            : "Gagal terhubung ke database.";
  }

  const ok = env.MONGODB_URI && env.AUTH_SECRET && database === "ok";
  return NextResponse.json({ ok, env, database, message }, { status: ok ? 200 : 503 });
}
