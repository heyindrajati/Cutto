# Cutto

Turn long images into killer carousels — drop an image, pick a slide count, slice, and download.

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Yang masih perlu kamu sesuaikan

Nilai desain di `tailwind.config.ts` (warna) adalah **estimasi visual** dari
screenshot Figma, bukan nilai exact. Sebelum deploy final, cek di Figma
(Inspect panel) lalu update di `tailwind.config.ts`:

- `colors.ink` — warna teks navy/heading
- `colors.brand.pink` / `colors.brand.purple` — gradient tombol & logo
- `colors.accent.orange` — warna step aktif / slide count terpilih
- `colors.cocoa` — warna label "Drop your image here"
- `colors.pastel.*` — warna pill format file (JPG/PNG/WEBP)

Font sudah dipasang sesuai permintaan: **Bricolage Grotesque** (display/heading)
dan **Inter** (body), dimuat otomatis lewat `next/font/google` di `app/layout.tsx`
— tidak perlu setup tambahan.

## Deploy ke Vercel

1. Push project ini ke GitHub repo baru
2. Buka https://vercel.com → **Add New Project**
3. Pilih repo tadi → Vercel otomatis mendeteksi Next.js
4. Klik **Deploy**

Tidak ada environment variable yang dibutuhkan — semua proses (split gambar,
generate ZIP) berjalan di browser (client-side), sesuai klaim "No data stored"
di desain aslinya.
