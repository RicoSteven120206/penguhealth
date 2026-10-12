import Link from "next/link";

export default function NotFound() {
  return (
    <div className="card mx-auto max-w-md text-center">
      <h1 className="text-2xl">Halaman tidak ditemukan</h1>
      <p className="muted mt-2">Halaman yang Anda cari tidak ada atau bukan milik akun Anda.</p>
      <Link href="/dashboard" className="btn-primary mt-6">Kembali ke beranda</Link>
    </div>
  );
}
