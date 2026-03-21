# 🚀 PentaDosen 2.0

**PentaDosen 2.0** adalah sistem dashboard manajemen dokumen dan kinerja dosen yang komprehensif. Dirancang untuk menyederhanakan alur kerja administratif bagi Dosen dan Admin di perguruan tinggi.

---

## ✨ Fitur Utama

### 👨‍🏫 Untuk Dosen

- **📊 Dashboard Interaktif**: Ikhtisar statistik visual dan tampilan ringkas untuk metrik kinerja Anda.
- **🗄️ Document Vault (Gudang Dokumen)**: Repositori terpusat untuk mengelola dan mengunggah dokumen akademik (Penelitian, Publikasi, HKI, dll).
- **🔐 Manajemen Profil**: Memantau dan memperbarui data profil akademik lengkap Anda.

### 👑 Untuk Administrator (Admin)

- **📁 Pusat Kontrol Dokumen**: Memantau, menelusuri, dan menyaring semua dokumen yang diunggah ke dalam sistem.
- **✅ Modul Verifikasi**: Persetujuan dan verifikasi cepat untuk dokumen atau pembaruan data yang diajukan.
- **👥 Direktori Dosen**: Mengelola profil dan catatan kinerja dari seluruh dosen yang terdaftar.
- **🔄 Modul Sinkronisasi**: Mengintegrasikan atau melakukan pencocokan data dari sumber eksternal (seperti Google Scholar, dll).

---

## 🛠️ Ringkasan Teknologi (Tech Stack)

| Teknologi              | Tujuan / Fungsi                                                   |
| :--------------------- | :---------------------------------------------------------------- |
| **⚡ Vite 6**          | Perlengkapan Frontend modern berkecepatan tinggi                  |
| **⚛️ React 19**        | Pustaka UI inti menggunakan TypeScript                            |
| **🎨 Tailwind CSS 4**  | Penataan gaya utilitas tingkat lanjut dengan estetika premium     |
| **🧭 React Router 7**  | Alur rute (routing) client-side dengan proteksi hak akses (guard) |
| **✨ Motion (Framer)** | Animasi mikro dan transisi halaman yang dinamis dan halus         |
| **📈 Recharts**        | Grafik analitik data dashboard yang ringan dan responsif          |
| **🔧 Lucide React**    | Ikonografi modern yang bersih                                     |

---

## 🚀 Panduan Memulai

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi di komputer lokal Anda.

### 📋 Prasyarat

- **Node.js** (Versi 18 ke atas sangat disarankan)
- Paket manajer seperti **NPM** atau **Yarn**

---

### 📥 Tahapan Instalasi

1. **Instal seluruh dependensi (libraries):**

   ```bash
   npm install
   ```

2. **Pengaturan Variabel Lingkungan (Environment Variables):**  
   Konfigurasikan environtment Anda dengan menduplikat file `.env.example` menjadi `.env` (atau `.env.local`) untuk menyetel kunci API yang diperlukan.

   _(Contoh nilai dari AI Studio)_:

   ```env
   GEMINI_API_KEY="DIISI_DENGAN_API_KEY_ANDA"
   APP_URL="http://localhost:5173"
   ```

---

### 🏃 Menjalankan Aplikasi

| Perintah          | Aksi / Hasil                 | Keterangan                                                             |
| :---------------- | :--------------------------- | :--------------------------------------------------------------------- |
| `npm run dev`     | **Mulai Server Dev**         | Menjalankan aplikasi dengan _hot module reloading_ di `localhost:5173` |
| `npm run build`   | **Pembuatan Paket Produksi** | Mengoptimalkan file aset agar siap dihosting di server statis          |
| `npm run preview` | **Pratinjau Hasil Build**    | Menguji hasil kompresi produksi secara lokal sebelum deploy            |
| `npm run lint`    | **Pencecekan Tipe Data**     | Memvalidasi kebenaran TypeScript tanpa mengekstrak paket               |

---

<div align="center">
  <sub>Dibuat dengan ❤️ untuk Manajemen Akademik yang Lebih Baik</sub>
</div>
