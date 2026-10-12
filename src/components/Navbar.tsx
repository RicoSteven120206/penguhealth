import Link from "next/link";
import { getSession } from "@/lib/auth";
import { Logo } from "./Logo";
import { LogoutButton } from "./LogoutButton";

const LINKS = [
  { href: "/dashboard", label: "Beranda" },
  { href: "/asesmen", label: "Asesmen" },
  { href: "/checkin", label: "Check-in" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/akun", label: "Akun" },
];

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-laut-100 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-judul text-lg font-semibold text-laut">PenguHealth</span>
        </Link>

        {session?.consent ? (
          <div className="flex items-center gap-1 overflow-x-auto text-sm">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-lg px-3 py-2 text-laut hover:bg-laut-50">
                {l.label}
              </Link>
            ))}
            <LogoutButton />
          </div>
        ) : session ? (
          <LogoutButton />
        ) : (
          <div className="flex items-center gap-2">
            <Link href="/masuk" className="btn-secondary">Masuk</Link>
            <Link href="/daftar" className="btn-primary">Daftar</Link>
          </div>
        )}
      </nav>
    </header>
  );
}
