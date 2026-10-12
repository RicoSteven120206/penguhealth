import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

/**
 * Proteksi halaman:
 * - Halaman aplikasi wajib login.
 * - Pengguna yang belum menyetujui penggunaan data diarahkan ke /persetujuan.
 * - Pengguna yang sudah login tidak perlu melihat /masuk dan /daftar lagi.
 */
// /api/* tidak melewati middleware (lihat matcher), termasuk /api/health.
const PROTECTED = ["/dashboard", "/asesmen", "/hasil", "/checkin", "/riwayat", "/akun", "/persetujuan"];
const AUTH_PAGES = ["/masuk", "/daftar"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  const isAuthPage = AUTH_PAGES.includes(pathname);

  if (isProtected && !session) {
    const url = new URL("/masuk", req.url);
    url.searchParams.set("lanjut", pathname);
    return NextResponse.redirect(url);
  }

  if (session && !session.consent && isProtected && pathname !== "/persetujuan" && pathname !== "/akun") {
    return NextResponse.redirect(new URL("/persetujuan", req.url));
  }

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL(session.consent ? "/dashboard" : "/persetujuan", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)"],
};
