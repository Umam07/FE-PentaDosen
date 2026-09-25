# PentaDosen - Frontend Application

<p align="center">
  <img src="public/Insights-Analitik-Kinerja-—-PentaDosen-Penta-Dosen-Universitas-YARSI-08-31-2026_04_16_PM.webp" alt="PentaDosen Insights Preview" width="100%" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript 5.8" />
  <img src="https://img.shields.io/badge/Vite-6.2-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6.2" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4.1" />
  <img src="https://img.shields.io/badge/React_Router-7.1-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router 7.1" />
</p>

---

## 1. Ringkasan Platform

PentaDosen adalah platform sistem informasi manajemen portofolio dan pelacakan kinerja Tri Dharma Perguruan Tinggi (Pendidikan, Penelitian, dan Pengabdian kepada Masyarakat) untuk dosen di lingkungan Universitas YARSI.

Platform ini mengotomatisasi pendataan dan kalkulasi poin Key Performance Indicator (KPI) akademik secara transparan. Sistem mengintegrasikan rekam jejak publikasi ilmiah dari pengindeks internasional dan nasional (Scopus, Google Scholar, dan SINTA), mengotomatisasi pembobotan angka kredit berbasis peran kepenulisan (First Author, Corresponding Author, Co-Author), serta menyediakan tata kelola berkas penelitian, Hak Kekayaan Intelektual (HKI), dan buku ajar dalam antarmuka web modern yang responsif.

---

## 2. Lingkungan Akses Sistem

| Lingkungan | Tautan Akses | Keterangan |
| :--- | :--- | :--- |
| Production Resmi | [pentadosen.yarsi.ac.id](https://pentadosen.yarsi.ac.id/) | Domain institusi resmi Universitas YARSI untuk operasional dan evaluasi kinerja aktif. |
| Staging / Demo Publik | [www.pentadosen.site](https://www.pentadosen.site/) | Lingkungan demonstrasi publik dan pengujian pra-rilis fitur sistem. |

---

## 3. Fitur Sistem

### Modul Dosen
* **Dasbor & KPI Tracker**: Pemantauan akumulasi poin kinerja Tri Dharma, visualisasi tren penelitian per tahun, dan rekapitulasi status berkas.
* **Manajemen Publikasi Ilmiah**: Pelacakan metadata jurnal terindeks Scopus (Q1-Q4), Google Scholar, dan akreditasi SINTA (S1-S6), disertai konfigurasi peran kepenulisan (Corresponding / First Author).
* **Manajemen Penelitian**: Pencatatan data penelitian internal dan eksternal, skema pendanaan, status kelayakan, serta penautan dokumen bukti.
* **Manajemen HKI & Paten**: Inventarisasi sertifikat Hak Cipta, Paten, Desain Industri, dan Merek dengan integrasi penautan ke dokumen penelitian terkait.
* **Manajemen Buku Akademik**: Pengarsipan monograf, buku ajar, dan buku referensi ber-ISBN.
* **Pratinjau Berkas Terintegrasi**: Pengunggahan berkas bukti fisik (PDF) dan penampil dokumen in-app (*PDF viewer*).
* **Antarmuka Responsif Adaptif**: Konversi otomatis tata letak tabel ke format kartu dinamis (*Card List View*) pada perangkat layar sentuh dan ponsel pintar.

### Modul Administrator
* **Verifikasi Dokumen**: Antrean kerja verifikasi dokumen pengajuan dosen dengan alur persetujuan (*Approve*) atau penolakan (*Reject*).
* **Sistem Umpan Balik Validasi**: Mekanisme pemberian catatan evaluasi dan alasan revisi secara langsung kepada dosen pemohon.
* **Direktori Kinerja Dosen**: Pemantauan portofolio komprehensif, produktivitas publikasi, dan keaktifan berkala seluruh dosen antarprogram studi.
* **Sinkronisasi Data Eksternal**: Trigger sinkronisasi massal untuk penarikan data publikasi dan sitasi terbaru dari Scopus, Google Scholar, dan SINTA.
* **Log Aktivitas & Audit Trail**: Pencatatan histori aktivitas administratif untuk memastikan transparansi dan integritas data operasional.
* **Manajemen CMS & Master Bobot**: Konfigurasi parameter bobot poin KPI akademik dan pengelolaan template dokumen institusi.

### Modul Analitik Publik
* **Insights & Statistik Agregat**: Visualisasi perbandingan produktivitas penelitian antarfakultas dan program studi.
* **Distribusi Publikasi**: Analisis proporsi quartile jurnal Scopus, capaian SINTA, serta tren pertumbuhan sitasi universitas.
* **Dukungan Aksesibilitas**: Pengaturan tema Terang/Gelap (*Light & Dark Mode*) yang selaras dengan panduan WCAG 2.1 AA.

---

## 4. Tumpukan Teknologi (Tech Stack)

Aplikasi dibangun menggunakan arsitektur Single Page Application (SPA) dengan rincian pustaka utama sebagai berikut:

| Kategori | Paket / Teknologi | Versi | Peran Teknis |
| :--- | :--- | :--- | :--- |
| Framework Inti | React | `^19.0.0` | Pustaka antarmuka berbasis komponen reaktif |
| Bahasa | TypeScript | `~5.8.2` | Pengetikan statis ketat (*type safety*) |
| Build Tool | Vite | `^6.2.0` | Development server cepat (HMR) dan bundler aset produksi |
| Styling | Tailwind CSS | `^4.1.14` | Kerangka kerja utilitas CSS modern berkinerja tinggi |
| Routing | React Router DOM | `^7.13.1` | Manajemen navigasi rute klien dan proteksi hak akses |
| Animasi | Motion / Framer Motion | `^12.38.0` | Mikro-interaksi dan transisi elemen visual |
| Visualisasi Data | Recharts | `^3.8.0` | Komponen diagram batang, garis, dan visualisasi statistik |
| Ikonografi | Lucide React | `^0.546.0` | Paket ikon vektor standar antarmuka |
| Pemrosesan Berkas | React-PDF & ExcelJS | `^10.4.1` / `^4.4.0` | Rendering dokumen PDF di peramban dan pengolahan data spreadsheet |
| Primitif UI | Radix UI / Phantom UI | `^1.1.15` / `^1.4.0` | Komponen dialog modal, dropdown, dan efek skeleton loading |
| Notifikasi | Sonner | `^2.0.7` | Manajemen pesan toast non-intrusif |

---

## 5. Struktur Direktori Proyek

Proyek menggunakan pendekatan arsitektur berbasis fitur (*Feature-Driven Directory Structure*):

```text
src/
├── components/                     # Komponen antarmuka modular yang dapat digunakan ulang
│   ├── Home/                       # Komponen landing page publik (Navbar, Hero, Features, Footer)
│   ├── features/                   # Komponen fitur bersama (PdfPreviewModal, GuidedTour, Onboarding)
│   ├── layout/                     # Kerangka dashboard (Sidebar, Topbar, ThemeToggle, ScrollToTop)
│   ├── shared/                     # Komponen antarmuka umum (FilterBar, YearPicker, SearchBar)
│   ├── ui/                         # Komponen atomik dasar (Button, Dialog, DropdownSelect, Loader)
│   └── SEO.tsx                     # Pengelolaan metadata dokumen dan tag Open Graph
│
├── lib/                            # Modul fungsi pembantu dan utilitas sistem
│   └── utils.ts                    # Utilitas styling (clsx, tailwind-merge) dan format data
│
├── pages/                          # Halaman modul utama sistem
│   ├── admin/                      # Portal fungsional Administrator
│   │   ├── ActivityLogs/           # Audit trail log aktivitas sistem
│   │   ├── AdminAllDocuments/      # Direktori komprehensif seluruh dokumen institusi
│   │   ├── AdminInputDocument/     # Formulir input berkas administratif manual
│   │   ├── AdminSync/              # Panel sinkronisasi API data dosen dan publikasi
│   │   ├── CmsDashboard/           # Dasbor manajemen konten dan analitik master KPI
│   │   ├── LecturerProfile/        # Tinjauan profil dosen dari sisi administrator
│   │   ├── Lecturers/              # Pengelolaan direktori daftar dosen institusi
│   │   └── Verification/           # Alur kerja verifikasi berkas (Approve / Reject)
│   │
│   ├── auth/                       # Modul autentikasi pengguna
│   │   ├── LoginPage.tsx           # Halaman login dosen dan staf
│   │   ├── AdminLogin.tsx          # Halaman login administrator
│   │   └── services/               # Layanan HTTP autentikasi ke backend
│   │
│   ├── dashboard/                  # Modul analitik dan insight publik
│   │   ├── DepartementList/        # Statistik dan daftar per departemen/prodi
│   │   ├── Insights/               # Grafik agregasi kinerja riset dan sitasi institusi
│   │   ├── LecturerList/           # Direktori publik dosen dengan filter interaktif
│   │   └── LecturerProfileInsights/# Detail capaian kinerja individu dosen
│   │
│   ├── dosen/                      # Portal kinerja Dosen (Tri Dharma)
│   │   ├── dashboard/              # Dasbor capaian angka kredit dan poin KPI dosen
│   │   ├── publication/            # Pengelolaan publikasi jurnal internasional dan nasional
│   │   ├── research/               # Pengelolaan arsip data dan laporan penelitian
│   │   ├── hki/                    # Pengelolaan data paten, hak cipta, dan desain industri
│   │   ├── buku/                   # Pengelolaan data buku monograf dan buku ajar
│   │   └── FaqHelp/                # Pusat bantuan dan panduan penggunaan sistem
│   │
│   ├── profilediri/                # Pengaturan profil akun dan tautan identitas pengindeks
│   ├── Developers.tsx              # Halaman profil tim pengembang sistem (DUK Team)
│   └── Home.tsx                    # Landing page publik sistem PentaDosen
│
├── App.tsx                         # Konfigurasi routing utama, state sesi, dan global error interceptor
├── index.css                       # Variabel desain sistem Tailwind CSS dan styling global
├── main.tsx                        # Entry point eksekusi React DOM
└── phantom-ui.d.ts                 # Deklarasi tipe TypeScript untuk komponen web tambahan
```

---

## 6. Panduan Instalasi dan Menjalankan Aplikasi

### Prasyarat Sistem
* Node.js versi 18.x atau versi LTS yang lebih baru.
* Package manager: npm, yarn, atau pnpm.
* Git command line client.

### Langkah Instalasi
1. Kloning repositori frontend:
   ```bash
   git clone https://github.com/Umam07/FE-PentaDosen.git
   cd FE-PentaDosen
   ```

2. Pasang paket dependensi proyek:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal:
   ```bash
   npm run dev
   ```
   Aplikasi dapat diakses melalui alamat lokal `http://localhost:5173`.

---

## 7. Konfigurasi Jaringan dan Proxy API

Frontend memanggil endpoint backend menggunakan relative path (`/api/...`). Pengalihan rute ke server API backend diatur melalui konfigurasi berikut:

* **Lingkungan Pengembangan (Local Development)**:
  Dikonfigurasi melalui `vite.config.ts` menggunakan fitur Vite Proxy:
  ```typescript
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/storage': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  }
  ```

* **Lingkungan Produksi (Deployment Vercel)**:
  Dikonfigurasi melalui `vercel.json` menggunakan aturan URL rewrite:
  ```json
  {
    "rewrites": [
      {
        "source": "/api/(.*)",
        "destination": "https://be-pentadosen-production-4cae.up.railway.app/api/$1"
      },
      {
        "source": "/storage/(.*)",
        "destination": "https://be-pentadosen-production-4cae.up.railway.app/storage/$1"
      },
      {
        "source": "/uploads/(.*)",
        "destination": "https://be-pentadosen-production-4cae.up.railway.app/uploads/$1"
      },
      {
        "source": "/(.*)",
        "destination": "/index.html"
      }
    ]
  }
  ```

---

## 8. Skrip Perintah (Available Scripts)

| Perintah | Tujuan | Deskripsi Teknis |
| :--- | :--- | :--- |
| `npm run dev` | Menjalankan Dev Server | Menjalankan Vite server dengan fitur Hot Module Replacement (HMR). |
| `npm run build` | Kompilasi Produksi | Mengompilasi kode TypeScript dan mem-bundle aset ke direktori `dist/`. |
| `npm run preview` | Pratinjau Produksi | Menjalankan server lokal untuk menguji build produksi hasil kompilasi. |
| `npm run lint` | Validasi Tipe | Menjalankan compiler TypeScript (`tsc --noEmit`) untuk audit tipe data. |
| `npm run clean` | Pembersihan Aset | Menghapus direktori `dist/` untuk memastikan kompilasi bersih ulang. |

---

## 9. Konvensi Penulisan Kode

1. **Pengetikan Ketat (Strict Typing)**: Gunakan tipe data eksplisit pada parameter, props, dan return type fungsi. Hindari penggunaan tipe `any`.
2. **Standar Penamaan**:
   * Komponen UI: `PascalCase.tsx` (contoh: `PublicationTable.tsx`).
   * React Hooks: `camelCase.ts` dengan awalan `use` (contoh: `usePublication.ts`).
   * Layanan & Utilitas: `camelCase.ts` (contoh: `authService.ts`, `researchUtils.ts`).
   * Definisi Tipe: `kebab-case.types.ts` atau `camelCase.types.ts`.
3. **Pemisahan Logika Bisnis dan Antarmuka**: Seluruh mutasi data dan query HTTP dipisahkan ke dalam folder `services/` dan `hooks/` terkait, menjaga komponen tampilan tetap ringkas dan terfokus pada rendering.

---

## 10. Tim Pengembang dan Supervisi

Proyek PentaDosen dikembangkan dan dipelihara oleh DUK Team di bawah naungan Program Studi Teknik Informatika, Fakultas Teknologi Informasi, Universitas YARSI:

* **Dosen Pembimbing Utama**:
  * Nurmaya, S.Kom., M.Eng., Ph.D. — Pengarah Arsitektur Tata Kelola Data Akademik

* **Mahasiswa Pengembang Sistem (DUK Team)**:
  * Muhammad Syafi'ul Umam — Software Engineer ([GitHub](https://github.com/Umam07))
  * Kiki Aimar Wicaksana — Software Engineer ([GitHub](https://github.com/KikiAimarWicaksana))
  * Rafi Daniswara Anggoro Putra — Software Engineer ([GitHub](https://github.com/DanisMf))

---

<p align="center">
  Hak Cipta © 2026 PentaDosen • DUK Team — Universitas YARSI. Seluruh hak cipta dilindungi undang-undang.
</p>
