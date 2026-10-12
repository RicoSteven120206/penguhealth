# PenguHealth

Aplikasi web skrining mandiri burnout akademik mahasiswa berbasis **Copenhagen Burnout Inventory – Student Version (CBI-SV)**.
Karya tim untuk Proposal Lomba UINIC.

> PenguHealth adalah alat skrining, **bukan alat diagnosis**, dan tidak menggantikan layanan psikolog atau psikiater.

## Stack

| Lapisan | Teknologi |
| --- | --- |
| Bahasa | TypeScript |
| Framework | Next.js 15 (App Router): halaman dan REST API dalam satu proyek |
| Styling | Tailwind CSS (palet sesuai Design Brief) |
| Database | MongoDB + Mongoose |
| Autentikasi | Kata sandi bcrypt + sesi JWT (jose) di cookie httpOnly |
| Validasi | Zod |
| Grafik | Recharts |
| Font | Inter dan Poppins (di-host sendiri via @fontsource) |
| Test | Vitest |

## Menjalankan

Prasyarat: Node.js 20+ dan MongoDB (lokal atau [MongoDB Atlas](https://www.mongodb.com/atlas) gratis).

```bash
npm install
cp .env.example .env.local      # lalu isi MONGODB_URI dan AUTH_SECRET
npm run dev                     # http://localhost:3000
```

Membuat `AUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Perintah lain:

```bash
npm test          # unit test algoritma skor, rekomendasi, dan tren
npm run typecheck # pemeriksaan tipe TypeScript
npm run build     # build produksi
npm start         # menjalankan hasil build
```

## Alur aplikasi dan kodenya

Alur mengikuti bagian I (User Flow) di proposal.

| Langkah | Halaman | API | Logika |
| --- | --- | --- | --- |
| 1. Daftar / masuk | `/daftar`, `/masuk` | `POST /api/auth/register`, `POST /api/auth/login` | `lib/session.ts`, `lib/auth.ts` |
| 2. Persetujuan data | `/persetujuan` | `POST /api/consent` | Ditegakkan oleh `middleware.ts` |
| 3. Isi kuesioner CBI-SV (4 bagian) | `/asesmen` | `POST /api/assessments` | Butir di `lib/cbi.ts` |
| 4. Hitung skor per dimensi | – | (di server) | `scoreCbi()` di `lib/cbi.ts` |
| 5. Hasil tinggi → rujukan konseling | `/hasil/[id]` | `GET /api/assessments/[id]` | `ReferralCard` tampil paling atas |
| 6. Rekomendasi sesuai dimensi tertinggi | `/hasil/[id]` | – | `lib/recommendations.ts` |
| 7. Check-in harian | `/checkin` | `POST /api/checkins` | Satu data per hari (upsert) |
| 8. Grafik perkembangan | `/riwayat` | `GET /api/checkins`, `GET /api/assessments` | EWMA di `lib/trend.ts` |
| 9. Asesmen ulang tiap 2–4 minggu | `/dashboard` | – | `shouldReassess()` di `lib/trend.ts` |
| Hapus akun dan data | `/akun` | `DELETE /api/account` | Hak hapus data (UU PDP) |

## Algoritma penilaian skor

1. Setiap jawaban bernilai 100, 75, 50, 25, atau 0.
2. Butir 13 ("masih punya energi untuk keluarga dan teman") dinilai terbalik: `100 − nilai`.
3. Skor dimensi = rata-rata butirnya (0–100), hanya jika ≥ 50% butir terjawab.
4. Kategori: < 50 rendah, 50–74 sedang, 75–99 tinggi, 100 sangat tinggi (konvensi literatur CBI, indikatif).
5. Rujukan konseling ditampilkan bila **ada satu saja** dimensi berkategori tinggi atau sangat tinggi.
6. Skor **selalu dihitung ulang di server** dari jawaban mentah; nilai dari klien tidak dipercaya.

Contoh dari proposal (dimensi studi Utza): `(75+50+75+100+75+75+75)/7 = 75` → tinggi. Kasus ini ada di `tests/cbi.test.ts`.

## Analisis tren check-in

- Indeks kesejahteraan harian (0–100) = 40% mood + 40% energi + 20% skor tidur (7–9 jam = ideal).
- Tren dihaluskan dengan EWMA (α = 0,3).
- Asesmen ulang disarankan bila sudah ≥ 14 hari sejak asesmen terakhir, atau tren turun ≥ 10 poin dalam 7 check-in.

## Struktur direktori

```
penguhealth/
├── src/
│   ├── app/                         # Halaman (App Router) dan API
│   │   ├── page.tsx                 # Beranda publik
│   │   ├── daftar/  masuk/          # Autentikasi
│   │   ├── persetujuan/             # Informed consent
│   │   ├── dashboard/               # Ringkasan + pengingat asesmen ulang
│   │   ├── asesmen/                 # Kuesioner CBI-SV
│   │   ├── hasil/[id]/              # Skor, radar chart, rujukan, rekomendasi
│   │   ├── checkin/                 # Check-in harian
│   │   ├── riwayat/                 # Grafik perkembangan
│   │   ├── akun/                    # Profil dan hapus akun
│   │   └── api/
│   │       ├── auth/{register,login,logout}/route.ts
│   │       ├── consent/route.ts
│   │       ├── assessments/route.ts, [id]/route.ts
│   │       ├── checkins/route.ts
│   │       └── account/route.ts
│   ├── components/
│   │   ├── charts/                  # RadarScore, ScoreHistoryChart, WellbeingChart
│   │   ├── forms/                   # AuthForm, ConsentForm, Questionnaire, CheckInForm, DeleteAccount
│   │   └── ...                      # Navbar, Logo, ReferralCard, DimensionBars, dll.
│   ├── lib/
│   │   ├── cbi.ts                   # Butir CBI-SV + algoritma skor
│   │   ├── recommendations.ts       # Aturan rekomendasi
│   │   ├── trend.ts                 # Indeks harian, EWMA, aturan asesmen ulang
│   │   ├── session.ts  auth.ts      # Sesi JWT
│   │   ├── db.ts  queries.ts        # Koneksi dan kueri MongoDB
│   │   └── validation.ts            # Skema Zod
│   ├── models/                      # User, Assessment, CheckIn (Mongoose)
│   └── middleware.ts                # Proteksi halaman + gerbang persetujuan
├── tests/                           # Unit test (Vitest)
├── .env.example
└── tailwind.config.ts               # Palet Design Brief
```

## Deploy

Panduan lengkap langkah demi langkah ada di **[DEPLOY.md](./DEPLOY.md)** (Netlify + MongoDB Atlas).

Ringkasnya:

1. Buat cluster gratis di MongoDB Atlas, buat user database, izinkan akses `0.0.0.0/0`, salin connection string.
2. Push proyek ke GitHub, lalu impor ke Netlify. Pengaturan build sudah ada di `netlify.toml`.
3. Isi environment variable di dashboard Netlify: `MONGODB_URI`, `AUTH_SECRET`, dan `NEXT_PUBLIC_KONSELING_*`.
4. Setelah publish, buka `/api/health` dan pastikan hasilnya `"ok": true`.

## Catatan pengembangan lanjutan

- Terjemahan butir CBI-SV disusun tim dan perlu uji keterbacaan serta reliabilitas (Cronbach's alpha) pada sampel mahasiswa.
- Fitur prediksi risiko berbasis machine learning direncanakan setelah data check-in mencukupi, sebagai layanan terpisah.
- Pertimbangkan pembatasan laju (rate limiting) pada endpoint login sebelum dipakai publik.
