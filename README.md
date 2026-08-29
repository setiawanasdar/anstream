# 🎬 NontonAnime - Modern, Responsive & Eye-Friendly Anime Streaming Web

Platform streaming anime subtitle Indonesia modern, super responsif untuk Android & PC, bebas iklan mengganggu, dan menggunakan tema *Soft Eye-Friendly Dark Palette* yang nyaman di mata untuk menonton berlama-lama.

---

## ✨ Fitur Utama

- 🎨 **Soft Eye-Friendly Dark Theme**: Palet warna midnight slate & charcoal matte (`#0a0f18` / `#131b2a`) dengan aksen sejuk indigo & sky blue (`#6366f1` / `#38bdf8`).
- 📱 **Android Mobile-First & PWA**: Mobile Bottom Navigation Bar, drawer pemilihan episode/server yang mulus di layar sentuh, dan dukungan instalasi PWA (*Add to Home Screen*).
- ⚡ **Integrasi Sankavollerei API**: Menghubungkan seluruh data anime ongoing, anime tamat, jadwal mingguan harian, daftar genre, dan pencarian cepat.
- 📺 **Multi-Server Video Player**: Embed video player responsif dengan pergantian server instan (`odstream`, `ondesuhd`, `filedon`, `vidhide`, `mega`), navigasi episode, dan tautan unduhan MP4/MKV.
- 🗄️ **Supabase Auth & Database**: Watchlist (Bookmark), Riwayat Tontonan (*Resume Playback*), dan sinkronisasi hybrid (Cloud & LocalStorage).

---

## 🚀 Memulai (Getting Started)

### 1. Prasyarat
- Node.js v18+ atau v20+
- Akun Supabase (opsional jika ingin menggunakan cloud auth & sync)

### 2. Instalasi
```bash
# Clone repository
git clone https://github.com/USERNAME/REPO_NAME.git
cd REPO_NAME

# Install dependensi
npm install
```

### 3. Konfigurasi Environment (`.env.local`)
Salin file `.env.example` ke `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SANKAVOLLEREI_API_BASE_URL=https://www.sankavollerei.web.id
```

### 4. Menjalankan Server Lokal
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

---

## 🗄️ Setup Database Supabase

Jalankan skrip SQL yang tersedia di `supabase/schema.sql` pada **Supabase SQL Editor** untuk membuat tabel `profiles`, `bookmarks`, `watch_history`, dan trigger pengguna baru.

---

## ☁️ Deploy ke Vercel

1. Push project ke GitHub.
2. Buka [Vercel](https://vercel.com/) dan Import repository ini.
3. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SANKAVOLLEREI_API_BASE_URL`
4. Klik **Deploy**!

