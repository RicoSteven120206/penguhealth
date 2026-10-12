import type { Metadata } from "next";
// Font di-host sendiri (tanpa permintaan ke Google Fonts saat build atau saat dibuka pengguna).
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PenguHealth – Skrining Burnout Akademik",
  description: "Aplikasi web skrining mandiri burnout akademik mahasiswa berbasis CBI-SV.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen font-sans">
        <Navbar />
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="mx-auto max-w-5xl px-4 pb-10 pt-4 text-xs text-slate-500">
          PenguHealth · Skrining berbasis Copenhagen Burnout Inventory – Student Version (CBI-SV). Bukan alat diagnosis.
        </footer>
      </body>
    </html>
  );
}
