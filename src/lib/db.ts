import dns from "node:dns";
import mongoose from "mongoose";

/**
 * Perbaikan opsional untuk error "querySrv ECONNREFUSED" di Windows.
 * Beberapa versi Node.js di Windows tidak memakai DNS sistem saat mencari
 * record SRV (dipakai oleh connection string mongodb+srv://).
 * Isi MONGODB_DNS_SERVERS=8.8.8.8,1.1.1.1 di .env.local untuk memaksa DNS tertentu.
 * Cukup untuk pengembangan lokal; JANGAN diisi di Netlify (server Linux tidak terdampak).
 */
const dnsServers = process.env.MONGODB_DNS_SERVERS?.split(",")
  .map((s) => s.trim())
  .filter(Boolean);
if (dnsServers?.length) dns.setServers(dnsServers);

/**
 * Koneksi MongoDB yang di-cache agar tidak membuka koneksi baru
 * setiap kali route dipanggil (penting saat dev dan di serverless).
 */
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };

const globalForMongoose = globalThis as unknown as { _mongoose?: Cache };
const cache: Cache = globalForMongoose._mongoose ?? { conn: null, promise: null };
globalForMongoose._mongoose = cache;

export async function connectDb(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI belum diatur. Salin .env.example menjadi .env.local.");

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      // Serverless (Netlify Functions): pool kecil dan gagal cepat agar error terlihat jelas di log.
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 10_000,
    });
  }
  try {
    cache.conn = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.conn;
}
