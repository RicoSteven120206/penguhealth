# Deploy PenguHealth ke Netlify + MongoDB Atlas

Arsitektur produksi:

```
Pengguna ──> Netlify (Next.js: halaman, API, middleware) ──> MongoDB Atlas (database)
```

Kenapa tidak memakai Netlify Database? Netlify Database adalah **Postgres**, sedangkan PenguHealth
memakai **MongoDB** (Mongoose). Netlify tetap menjalankan aplikasinya, dan database-nya ada di
MongoDB Atlas (gratis, tanpa batas waktu).

Perkiraan waktu: 30–45 menit. Biaya: Rp0 (Netlify Free + Atlas Free M0).

---

## Tahap 1 – Siapkan database di MongoDB Atlas

1. Buka https://cloud.mongodb.com, daftar, dan verifikasi email.
2. Klik **Build a Database** (atau **Create**), pilih **Free (M0)**.
   - Provider: AWS. Region: **Singapore (ap-southeast-1)** agar dekat dengan Indonesia.
   - Nama cluster: biarkan `Cluster0`. Klik **Create Deployment**.
3. Buat user database (panel **Security Quickstart**):
   - Pilih **Username and Password**.
   - Username: `penguhealth_app`.
   - Klik **Autogenerate Secure Password**, lalu **salin dan simpan** password-nya.
   - Klik **Create User**.
4. Atur akses jaringan (**Network Access** / **IP Access List**):
   - Klik **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.
   - Ini wajib: server Netlify memakai IP yang berubah-ubah, jadi IP tetap tidak bisa didaftarkan.
     Keamanannya dijaga oleh username dan password database yang kuat.
5. Ambil connection string:
   - Klik **Connect** pada cluster → **Drivers** → Node.js.
   - Salin string-nya, contoh:
     ```
     mongodb+srv://penguhealth_app:<db_password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Ganti `<db_password>` dengan password dari langkah 3.
   - Tambahkan nama database `penguhealth` setelah `.mongodb.net/`:
     ```
     mongodb+srv://penguhealth_app:PASSWORD@cluster0.xxxxx.mongodb.net/penguhealth?retryWrites=true&w=majority&appName=Cluster0
     ```
   - Jika password berisi karakter `@ : / ? # [ ] %`, ubah ke bentuk URL-encoded
     (misalnya `@` menjadi `%40`). Password hasil Autogenerate biasanya aman.

Ini nilai **MONGODB_URI**. Jangan dibagikan atau di-commit.

## Tahap 2 – Uji koneksi di komputer sendiri (opsional, sangat disarankan)

1. Isi `.env.local` dengan `MONGODB_URI` dari Atlas dan `AUTH_SECRET`:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Jalankan `npm run dev`, lalu buka http://localhost:3000/api/health.
3. Hasil yang benar: `{"ok":true, ..., "database":"ok"}`.
4. Coba alur lengkap: daftar → setujui → isi asesmen → lihat hasil → check-in.

Jika `/api/health` gagal di lokal, perbaiki dulu sebelum deploy (lihat Troubleshooting).

## Tahap 3 – Upload kode ke GitHub

1. Buat repository baru di https://github.com/new, misalnya `penguhealth`.
   Pilih **Private** jika belum ingin publik. **Jangan** centang "Add a README".
2. Di folder proyek:
   ```bash
   git init
   git add .
   git commit -m "PenguHealth: versi awal"
   git branch -M main
   git remote add origin https://github.com/USERNAME/penguhealth.git
   git push -u origin main
   ```
3. Pastikan `.env.local` **tidak** ikut terunggah (sudah diatur di `.gitignore`).
   Cek di halaman GitHub: file itu tidak boleh muncul.

## Tahap 4 – Buat site di Netlify

1. Buka https://app.netlify.com, masuk dengan akun GitHub.
2. **Add new project** (atau **Add new site**) → **Import an existing project** → **GitHub**.
3. Izinkan Netlify mengakses repository `penguhealth`, lalu pilih repository tersebut.
4. Periksa pengaturan build (seharusnya sudah terisi otomatis dari `netlify.toml`):

   | Pengaturan | Nilai |
   | --- | --- |
   | Branch to deploy | `main` |
   | Base directory | (kosong) |
   | Build command | `npm run build` |
   | Publish directory | `.next` |

5. **Sebelum klik Deploy**, isi environment variables (Tahap 5). Jika tombolnya sudah
   terlanjur diklik, tidak masalah: isi variabelnya, lalu deploy ulang.

## Tahap 5 – Isi environment variables

Lokasi: **Site configuration → Environment variables → Add a variable**
(atau bagian **Environment variables** di layar import).

| Key | Value | Keterangan |
| --- | --- | --- |
| `MONGODB_URI` | connection string dari Tahap 1 | Rahasia |
| `AUTH_SECRET` | string acak 64 karakter (perintah di Tahap 2) | Rahasia. Gunakan nilai baru, bukan yang dipakai di lokal |
| `NEXT_PUBLIC_KONSELING_NAMA` | contoh: `Layanan Konseling Universitas X` | Tampil di kartu rujukan |
| `NEXT_PUBLIC_KONSELING_KONTAK` | contoh: `konseling@kampus.ac.id / 0812-xxxx` | Tampil di kartu rujukan |
| `NEXT_PUBLIC_KONSELING_JADWAL` | contoh: `Senin–Jumat, 08.00–16.00 WIB` | Tampil di kartu rujukan |

Aturan penting:
- Biarkan **Scopes = All scopes** (default). Middleware berjalan di Edge Functions dan
  hanya bisa membaca variabel yang memiliki scope **Functions**.
- **Jangan** menulis variabel ini di `netlify.toml`: variabel di file itu tidak terbaca oleh
  Functions dan Edge Functions saat runtime, dan file itu ikut ter-commit ke GitHub.
- Variabel `NEXT_PUBLIC_*` ditanam saat build. Setiap kali diubah, lakukan deploy ulang.

## Tahap 6 – Deploy

1. Klik **Deploy** (atau **Deploys → Trigger deploy → Deploy site**).
2. Tunggu status **Published** (sekitar 2–4 menit). Jika gagal, buka log deploy (Troubleshooting).
3. Netlify memberi alamat seperti `https://nama-acak-123.netlify.app`.

## Tahap 7 – Verifikasi setelah publish

1. Buka `https://NAMA-SITE.netlify.app/api/health`.
   Harus muncul `"ok":true` dan `"database":"ok"`.
2. Uji alur lengkap di HP dan laptop:
   - [ ] Daftar akun baru
   - [ ] Halaman persetujuan muncul, centang, lanjut
   - [ ] Isi 25 butir asesmen → halaman hasil, radar chart, rekomendasi
   - [ ] Isi asesmen dengan jawaban tinggi → kartu rujukan konseling tampil paling atas
   - [ ] Isi check-in harian
   - [ ] Buka Riwayat
   - [ ] Keluar, lalu masuk lagi
   - [ ] Hapus akun (pakai akun uji)
3. Di Atlas, buka **Browse Collections** dan pastikan koleksi `users`, `assessments`, dan
   `checkins` sudah terisi.

## Tahap 8 – Rapikan nama site

- **Site configuration → Change site name** → misalnya `penguhealth` sehingga alamatnya
  `https://penguhealth.netlify.app` (jika nama itu masih tersedia).
- Domain sendiri (opsional): **Domain management → Add a domain**.

## Update aplikasi setelahnya

Setiap `git push` ke branch `main` otomatis memicu deploy baru. Untuk mencoba perubahan tanpa
mengganggu versi publik, buat branch lain dan buka Pull Request; Netlify membuat **Deploy Preview**
dengan alamat terpisah.

Catatan: Deploy Preview memakai `MONGODB_URI` yang sama dengan produksi. Untuk uji coba, buat
akun uji dan hapus setelah selesai, atau beri nilai `MONGODB_URI` khusus untuk konteks
**Deploy Previews** yang mengarah ke database lain (misalnya `penguhealth_preview`).

---

## Troubleshooting

| Gejala | Penyebab umum | Solusi |
| --- | --- | --- |
| `/api/health`: "Tidak bisa menjangkau MongoDB" | `0.0.0.0/0` belum ditambahkan di Atlas, atau cluster masih dibuat | Atlas → Network Access → tambahkan `0.0.0.0/0`, tunggu status **Active** |
| `/api/health`: "Ditolak MongoDB" | Username/password salah atau belum di-URL-encode | Reset password user di Atlas, perbarui `MONGODB_URI`, deploy ulang |
| `/api/health`: `"MONGODB_URI": false` | Variabel belum diisi atau salah nama | Periksa ejaan key, lalu deploy ulang |
| `/api/health`: `"AUTH_SECRET": false` | Kosong atau kurang dari 32 karakter | Buat ulang dengan perintah di Tahap 2 |
| Setelah login langsung kembali ke halaman Masuk | `AUTH_SECRET` tidak terbaca oleh middleware (scope bukan Functions) | Set scope ke **All scopes**, deploy ulang |
| Build gagal: "Cannot find module ..." | `package-lock.json` tidak ikut di-commit | Commit `package-lock.json`, push ulang |
| Build gagal karena versi Node | Versi Node tidak sesuai | `netlify.toml` sudah mengatur Node 22; pastikan file itu ikut ter-commit |
| Kartu rujukan masih berisi teks bawaan | Variabel `NEXT_PUBLIC_*` diubah setelah build | Deploy ulang |

Log yang berguna:
- Log build: **Deploys → pilih deploy → Deploy log**.
- Log runtime (error API): **Logs → Functions**, atau **Logs → Edge Functions** untuk middleware.

## Keamanan sebelum dipakai publik

- [ ] `AUTH_SECRET` produksi berbeda dari lokal dan tidak pernah dibagikan.
- [ ] Password user Atlas kuat (hasil Autogenerate).
- [ ] Repository GitHub tidak memuat `.env.local`.
- [ ] Teks kontak konseling sudah benar dan sudah dikonfirmasi ke pihak kampus.
- [ ] Pertimbangkan rate limiting pada endpoint login.
- [ ] Atlas M0 tidak punya backup otomatis. Untuk data uji pengguna (bagian J proposal),
      ekspor data secara berkala dari Atlas (**Browse Collections → Export**).

Referensi:
- Netlify – Next.js: https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/
- Netlify – Environment variables: https://docs.netlify.com/build/environment-variables/overview/
- Netlify – Edge Functions env vars: https://docs.netlify.com/build/edge-functions/environment-variables/
- Netlify Database (Postgres): https://docs.netlify.com/build/data-and-storage/netlify-database/
