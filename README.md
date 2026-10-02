# Cutto

Turn long images into killer carousels — drop an image, pick a slide count, slice, and download.
Design source: Figma "Carousel Slicer App" → page "Split Screen Concept".

## Menjalankan di lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000

## Struktur

| File | Isi |
|---|---|
| `app/page.tsx` | Alur 4 step + **teks sidebar tiap step** (bagian `COPY`) |
| `components/Shell.tsx` | Layout: background, card 1045×648, sidebar, footer |
| `components/Background.tsx` | Background ungu + 3 blob blur |
| `components/StepList.tsx` | Daftar step (vertikal di desktop, horizontal di mobile) |
| `components/UploadPanel.tsx` | Step 1 — area upload |
| `components/ChoosePanel.tsx` | Step 2 & 3 — pilih jumlah slide, preview potongan, tombol slice |
| `components/DownloadPanel.tsx` | Step 4 — slide strip, download |
| `components/PrimaryButton.tsx` | Tombol gradient utama |
| `lib/slicer.ts` | Logika potong gambar (jalan di browser) |
| `lib/backgrounds.ts` | Daftar foto background + kredit fotografer |
| `tailwind.config.ts` | Warna, gradient, shadow — semua dari Figma |
| `public/cutto-logo.svg`, `public/icons/` | Logo & ikon, diekspor langsung dari Figma |

## Layout

- **Desktop (≥1024px):** tinggi halaman = 100% layar, tanpa scroll. Card 1045 × 648px di tengah; hanya mengecil kalau layar terlalu pendek.
- **Mobile/tablet:** card ditumpuk (sidebar di atas, step horizontal), halaman scroll biasa.
- **Step 3** = layar loading saat proses slicing (minimal ±1,2 detik), tombol menampilkan progres "Slicing 3/6…".

## Background foto

8 foto pilihan dari Unsplash (Unsplash License) berganti tiap 10 detik, dengan kredit "Photo by … on Unsplash" di footer.
Foto dimuat langsung dari CDN Unsplash, ukurannya otomatis menyesuaikan layar. Tidak perlu API key.

- Daftar foto + nama fotografer: `lib/backgrounds.ts` (cara menambah/ganti foto ada di komentar paling atas file itu)
- Kecepatan ganti: `ROTATE_EVERY_MS` di file yang sama
- Foto yang gagal dimuat otomatis dilewati; kalau semua gagal, background kembali ke ungu brand

## Deploy

Semua proses jalan di browser — tidak ada server, tidak ada environment variable.
GitHub Desktop: Commit → Push origin, Vercel otomatis deploy.
