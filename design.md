# 🎨 Panduan Sistem Desain & Nuansa UI: PentaDosen 2.0

Dokumen ini disusun sebagai panduan desain lengkap untuk mempermudah perancangan UI di **Google Sites / Slides** maupun untuk proses import/pembuatan aset visual di **Figma**.

---

## 🌟 1. Filosofi & Konsep Desain

PentaDosen 2.0 mengusung tema **"High-Tech Academic Workspace"**. Berbeda dengan sistem administrasi kampus tradisional yang sering kali kaku dan monoton, PentaDosen memadukan fungsionalitas akademik dengan estetika modern seperti dasbor developer premium, *glassmorphism*, dan tipografi monospaced yang sangat rapi.

### Karakteristik Utama Nuansa (Vibe)
*   **Modern & Sleek:** Menggunakan efek kaca semi-transparan (*frosted glass*) dengan *backdrop blur* premium.
*   **Clean & Disciplined:** Penataan grid yang sangat presisi dengan jarak (*spacing*) yang konsisten.
*   **Developer/Academic Edgy:** Penggunaan huruf bertipe *monospace* memberikan kesan bahwa data terstruktur dengan akurasi tinggi dan berteknologi mutakhir.
*   **Vibrant & Interactive:** Aksen warna biru segar (*fresh blue*) dipadukan dengan efek menyala (*glow*) halus pada elemen teks penting atau tombol aksi.

---

## 🎨 2. Palet Warna (Color System)

PentaDosen memiliki sistem pewarnaan yang dioptimalkan untuk performa tinggi baik di **Mode Terang (Light Mode)** maupun **Mode Gelap (Dark Mode)**.

### A. Warna Utama (Primary - Blue Accent)
Digunakan untuk tombol utama, indikator aktif, *link*, dan aksen grafik visual:
*   `Primary-50`: `#eff6ff` (Latar belakang hover sangat halus)
*   `Primary-100`: `#dbeafe`
*   `Primary-200`: `#bfdbfe`
*   `Primary-300`: `#93c5fd`
*   `Primary-400`: `#60a5fa`
*   `Primary-500`: `#3b82f6` (Warna Biru Utama / Brand Color)
*   `Primary-600`: `#2563eb` (Warna Hover Aktif)
*   `Primary-700`: `#1d4ed8`
*   `Primary-800`: `#1e40af`
*   `Primary-900`: `#1e3a8a`
*   `Primary-950`: `#172554`

### B. Mode Terang (Light Mode)
Menciptakan ruang kerja akademik yang bersih, ramah, dan profesional.
*   **Latar Belakang Halaman (Page BG):** `#f8fafc` (Slate 50)
*   **Latar Belakang Komponen (Surface BG):** `#ffffff` (White - Card/Sidebar)
*   **Teks Utama (Primary Text):** `#0f172a` (Slate 900)
*   **Teks Sekunder (Secondary Text):** `#64748b` (Slate 500)
*   **Garis Batas (Border Color):** `#f1f5f9` (Slate 100)

### C. Mode Gelap (Dark Mode)
Menciptakan tampilan dasbor bernuansa premium *cyber-workspace* yang nyaman untuk mata bekerja dalam waktu lama.
*   **Latar Belakang Halaman (Page BG):** `#020617` (Slate 950)
*   **Latar Belakang Komponen (Surface BG):** `#0f172a` (Slate 900 - Card/Sidebar)
*   **Teks Utama (Primary Text):** `#f8fafc` (Slate 50)
*   **Teks Sekunder (Secondary Text):** `#94a3b8` (Slate 400)
*   **Garis Batas (Border Color):** `#1e293b` (Slate 800)

### D. Warna Status & Fungsional
*   **Sukses (Success/Verify):** `#10b981` (Emerald 500) / Green Glow
*   **Peringatan (Warning/Pending):** `#f59e0b` (Amber 500)
*   **Bahaya/Tolak (Danger/Reject):** `#ef4444` (Red 500)

---

## 🔠 3. Tipografi (Typography)

Sistem tipografi PentaDosen 2.0 menggunakan kombinasi jenis huruf sans-serif modern dan monospace yang presisi. Di Figma, silakan unduh dan terapkan font Google gratis berikut ini:

1.  **Plus Jakarta Sans (Google Fonts)**
    *   *Fungsi:* Font utama untuk seluruh antarmuka teks, heading, label menu, dan paragraf.
    *   *Kesan:* Sangat terbaca, bersih, profesional, dan ergonomis untuk penggunaan jangka panjang.
2.  **JetBrains Mono (Google Fonts)**
    *   *Fungsi:* Font sekunder untuk angka, statistik, metrik dasbor, dan data tabular.
    *   *Kesan:* Sangat mudah dibaca untuk angka desimal, persentase, dan deretan kode/sandi dokumen.

### Panduan Skala Tipografi (Figma & Google Sites)
*   **Display Title (Hero Section):** `48px` - `64px` | Bold / Extra Bold
*   **H1 (Page Title):** `30px` - `36px` | Semi-Bold
*   **H2 (Section Title):** `24px` | Semi-Bold
*   **H3 (Card Header):** `18px` - `20px` | Medium / Semi-Bold
*   **Body Text (Paragraf):** `14px` - `16px` | Regular
*   **Subtext / Caption (Keterangan):** `12px` | Light / Regular

---

## ✨ 4. Efek Khusus & Visual Style

Untuk menghidupkan visual di Figma atau platform visual lainnya, terapkan efek-efek berikut:

### A. Glassmorphism Effect (`.glass-effect`)
Efek kaca transparan buram yang menjadi ciri khas PentaDosen.
*   **Figma Mix:**
    *   Fill: `#ffffff` dengan Opacity `10%` (Mode Terang) ATAU `#0f172a` dengan Opacity `20%` (Mode Gelap)
    *   Stroke: `#ffffff` dengan Opacity `20%` (Ketebalan `1px`)
    *   Effects: *Background Blur* sebesar `20px`

### B. Text Glow Effect (`.text-glow`)
Efek teks menyala halus untuk memusatkan perhatian pada kata kunci atau metrik penting.
*   **Figma Mix:**
    *   Terapkan *Drop Shadow* pada Teks.
    *   Color: `#3b82f6` (Primary Blue) dengan Opacity `50%`
    *   Blur: `20px`, X: `0`, Y: `0`

### C. Shadows (Bayangan Card & Pop-up)
*   **Light Mode Shadow:** `rgba(0, 0, 0, 0.05)` dengan blur `10px`, Y: `4px`
*   **Dark Mode Shadow:** `rgba(0, 0, 0, 0.4)` dengan blur `15px`, Y: `8px` (Lebih pekat agar card terlihat menonjol dari latar belakang Slate-950)

### D. Sudut Membulat (Corner Radius)
Konsistensi kelengkungan sudut objek sangat penting:
*   **Tombol Kecil & Badge:** `6px` (`rounded-sm`)
*   **Input & Tombol Standar:** `8px` (`rounded-md`)
*   **Card & Sidebar:** `12px` - `16px` (`rounded-xl` hingga `rounded-2xl`)
*   **Modal & Onboarding Dialog:** `24px` (`rounded-3xl`)

---

## 🧱 5. Struktur & Komponen Kunci UI

### A. Tata Letak Utama (Dashboard Layout Grid)
Aplikasi di dalam dasbor menggunakan tata letak dua kolom:
1.  **Sidebar Kiri (Navigasi):**
    *   Lebar tetap: `280px`
    *   Warna: `Surface BG` dengan garis pemisah (*border*) `1px` di sisi kanan.
    *   Fitur: Logo PentaDosen di bagian atas, deretan item navigasi berikon Lucide React, profil pengguna di bagian paling bawah.
2.  **Konten Utama (Main Content Area):**
    *   Mengisi sisa lebar layar secara responsif.
    *   Dilengkapi dengan **Topbar** di bagian atas (berisi pencarian global, tombol notifikasi lonceng dinamis, dan sakelar Mode Gelap/Terang).
    *   Padding konten: `24px` (`p-6`) hingga `32px` (`p-8`).

### B. Komponen Dasbor yang Perlu Dibuat di Figma
1.  **Metric Statistics Card:**
    *   Card kecil berisi ikon berwarna biru aksen, angka statistik besar (contoh: "14 Penelitian"), tren persentase kenaikan (contoh: "+12%"), dan judul metrik.
2.  **Interactive Recharts Card:**
    *   Area visualisasi grafik garis (*line charts*) atau diagram batang (*bar charts*) dengan sumbu yang bersih, legenda minimalis, dan garis grid tipis berwarna border.
3.  **Document Vault Table:**
    *   Tabel interaktif dengan baris data dokumen. Setiap baris memiliki kolom: Judul Dokumen, Kategori (Penelitian/Publikasi/HKI/Buku), Status Verifikasi (Badge dengan warna status), Tanggal Unggah, dan tombol aksi (Lihat/Unduh/Edit).
4.  **Onboarding Dialog Modal:**
    *   Jendela pop-up berukuran sedang dengan animasi transisi yang mulus. Digunakan untuk membimbing pengguna baru saat pertama kali masuk dasbor.
5.  **Action Search Bar:**
    *   Kolom pencarian dengan pintasan keyboard di ujung kanannya (misal: `⌘K` atau `Ctrl+K`) dengan ikon kaca pembesar elegan di ujung kiri.

---

## 🗺️ 6. Peta Alur Halaman (Page Architectures)

Untuk memudahkan Anda merancang alur halaman di Figma, berikut adalah daftar halaman utama beserta konten yang harus ada di dalamnya:

### 🏠 Landing Page (Halaman Utama)
*   **Navbar:** Frosted glass, Logo, Link menu (Fitur, Tentang Kami, Alur Kerja), tombol "Masuk ke Dashboard".
*   **Hero Section:** Slogan persuasif bernuansa tech-academic, ilustrasi dasbor semi-abstrak interaktif, tombol CTA (Call to Action).
*   **Features Grid:** Showcase keunggulan sistem (Keamanan Dokumen, Sinkronisasi Google Scholar otomatis, Statistik Kinerja).
*   **Workflow Section:** Diagram alur kerja unggah dokumen dosen hingga diverifikasi admin.
*   **Testimonial Circle:** Blok bundar interaktif berisi kutipan dari dosen-dosen yang terbantu oleh sistem.

### 👨‍🏫 Dasbor Dosen (Lecturer Portal)
*   **Beranda Dasbor:** Statistik dokumen akademik, grafik tren publikasi tahunan, daftar tugas/dokumen tertunda.
*   **Document Vault (Gudang Dokumen):** Repositori terbagi per kategori (Penelitian, Publikasi, HKI, Buku) dilengkapi filter pencarian.
*   **PentaInsight (Analitik):** Analisis statistik kinerja dosen yang mendalam, grafik sitasi, dan proyeksi indeks akademik.
*   **Profil Diri:** Biodata lengkap akademik, riwayat pengajaran, kepangkatan, dan pengaturan integrasi akun eksternal.

### 👑 Dasbor Admin (Admin Portal)
*   **Pusat Verifikasi:** Halaman khusus untuk menyetujui (*verify*) atau menolak (*reject*) pengajuan dokumen dari dosen dengan catatan umpan balik (*feedback*).
*   **Direktori Dosen:** Daftar nama seluruh dosen di universitas/jurusan, beserta grafik agregat publikasi tingkat departemen.
*   **Module Sync (Sinkronisasi):** Fitur untuk menarik data otomatis dari database eksternal/Google Scholar.
*   **Log Aktivitas (Activity Logs):** Rekaman jejak audit sistem yang teratur dan kronologis untuk memantau perubahan dokumen.

---

Dengan mengikuti panduan visual di atas, desain yang Anda bangun di Google Sites maupun Figma akan memiliki **keselarasan estetika 100%** dengan implementasi kode frontend PentaDosen 2.0! Dapatkan kesan antarmuka profesional yang rapi, mewah, dan berkinerja tinggi.
