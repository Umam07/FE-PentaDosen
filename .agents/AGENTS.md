# PentaDosen Frontend — Konvensi & Aturan Kode

> Dokumen ini adalah sumber kebenaran untuk semua konvensi kode, penamaan, struktur folder, dan aturan refactoring di project PentaDosen frontend (React + TypeScript + Tailwind).

---

## 1. Arsitektur Folder Fitur (Feature-Based Structure)

Setiap halaman/fitur **WAJIB** ditempatkan dalam folder sendiri di bawah `src/pages/`, terorganisir per role:

**Semua folder fitur menggunakan PascalCase**, tanpa kecuali — baik admin maupun dosen.

```
src/pages/
├── admin/
│   ├── Verification/
│   ├── Lecturers/
│   ├── LecturerProfile/
│   ├── CmsDashboard/
│   ├── ActivityLogs/
│   ├── AdminSync/            ← folder baru (hasil refactor dari AdminSync.tsx)
│   ├── AdminInputDocument/   ← folder baru (hasil refactor dari AdminInputDocument.tsx)
│   └── AdminAllDocuments/    ← folder baru (hasil refactor dari AdminAllDocuments.tsx)
├── dosen/
│   ├── Publication/          ← PascalCase (sebelumnya publication/)
│   ├── Research/             ← PascalCase (sebelumnya research/)
│   ├── Buku/                 ← PascalCase (sebelumnya buku/)
│   ├── Hki/                  ← PascalCase (sebelumnya hki/)
│   ├── Dashboard/            ← PascalCase (sebelumnya dashboard/)
│   └── FaqHelp/              ← folder baru (hasil refactor dari FaqHelp.tsx)
├── Dashboard/
├── Auth/
└── ProfileDiri/
```

### Struktur Internal Setiap Folder Fitur

```
NamaFitur/
├── NamaFiturPage.tsx           ← Komponen page utama (orchestrator)
├── components/
│   ├── NamaFiturHeader.tsx
│   ├── NamaFiturTable.tsx
│   ├── NamaFiturFilter.tsx
│   └── ...
├── hooks/
│   └── useNamaFitur.ts
├── services/
│   └── namaFiturService.ts
├── types/
│   └── namaFitur.types.ts
├── utils/                      ← opsional, hanya jika ada helper murni
│   └── namaFiturUtils.ts
└── constants.ts                ← opsional, hanya jika ada konstanta khusus fitur
```

---

## 2. Penamaan File — ATURAN WAJIB

### ❌ DILARANG: `index.tsx` sebagai page component

**JANGAN** gunakan `index.tsx` sebagai nama file page utama. Ini menyebabkan:
- Semua tab di editor bernama `index.tsx` → tidak bisa dibedakan
- Pencarian file (`Ctrl+P`) kebanjiran hasil `index.tsx`
- Git log/blame ambigu
- Stack trace debugging tidak informatif

### ✅ WAJIB: Named page file dengan suffix `Page`

| Jenis File | Pola Penamaan | Contoh |
|---|---|---|
| Page utama (orchestrator) | `[NamaFitur]Page.tsx` | `VerificationPage.tsx` |
| Sub-komponen | `[NamaFitur][Fungsi].tsx` | `VerificationTable.tsx`, `VerificationFilter.tsx` |
| Custom hook | `use[NamaFitur].ts` | `useVerification.ts` |
| Service/API layer | `[namaFitur]Service.ts` | `verificationService.ts` |
| Types/interfaces | `[namaFitur].types.ts` | `verification.types.ts` |
| Utils/helpers | `[namaFitur]Utils.ts` | `lecturersUtils.ts` |
| Constants | `constants.ts` | `constants.ts` |

### ❌ DILARANG: Barrel File `index.ts` / `index.tsx`

**JANGAN** gunakan `index.ts` maupun `index.tsx` di dalam folder fitur/halaman. Alasan:
- Membuat tab editor ambigu (banyak file bernama `index`)
- Menyembunyikan resolusi import — developer harus menebak file mana yang dimaksud
- Production bundle chunk names menjadi `index-xxx.js` yang tidak informatif
- Menambah layer abstraksi yang tidak perlu

### ✅ WAJIB: Direct File Import (Explicit Path)

Semua import di `App.tsx` dan antar modul harus mengarah **langsung ke file page** dengan nama eksplisit:

```ts
// ✅ BENAR — import langsung ke file page
const Publication = lazy(() => import('./pages/dosen/publication/PublicationPage'));
const AdminVerification = lazy(() => import('./pages/admin/Verification/VerificationPage'));
const Profile = lazy(() => import('./pages/profilediri/Profile/ProfilePage'));

// ❌ SALAH — import ke folder (mengandalkan index resolution)
const Publication = lazy(() => import('./pages/dosen/publication'));
const AdminVerification = lazy(() => import('./pages/admin/Verification'));
```

**Keuntungan pola direct import:**
- Tab editor selalu menampilkan nama file deskriptif (`PublicationPage.tsx`, bukan `index.tsx`)
- Go-to-file (Ctrl+P) langsung menemukan file yang tepat
- Production chunk names deskriptif: `PublicationPage-xxx.js`
- Git log/blame jelas per fitur
- Stack trace debugging langsung menunjukkan nama modul

---

## 3. Aturan Penamaan (Naming Conventions)

### Folder
- **Semua folder fitur**: PascalCase (`Verification/`, `Lecturers/`, `Publication/`, `Research/`)
- **Sub-folder internal** (`components/`, `hooks/`, `services/`, `types/`, `utils/`): selalu lowercase

### Komponen & File
- **Komponen React (`.tsx`)**: PascalCase — `VerificationTable.tsx`, `PublicationHeader.tsx`
- **Hook (`.ts`)**: camelCase dengan prefix `use` — `useVerification.ts`, `useLecturers.ts`
- **Service (`.ts`)**: camelCase — `verificationService.ts`
- **Types (`.ts`)**: camelCase dengan suffix `.types` — `verification.types.ts`
- **Utils (`.ts`)**: camelCase — `lecturersUtils.ts`

### Variabel, Fungsi & Tipe dalam Kode
- **Komponen**: PascalCase — `VerificationFilter`, `PublicationTable`
- **Hook**: camelCase + prefix `use` — `useVerification()`, `useLecturers()`
- **Fungsi biasa**: camelCase — `fetchPendingDocuments()`, `exportToExcel()`
- **Interface/Type**: PascalCase — `VerificationDocument`, `SessionUser`, `RejectingItem`
- **Props interface**: PascalCase + suffix `Props` — `VerificationTableProps`, `VerificationFilterProps`
- **Konstanta**: UPPER_SNAKE_CASE atau camelCase sesuai konteks
- **State variable**: camelCase deskriptif — `isTableLoading`, `selectedFakultas`, `rejectingItem` (HINDARI nama generik seperti `data`, `items`, `flag`)

---

## 4. Aturan Refactoring — JANGAN DILANGGAR

### Prinsip Utama
1. **TIDAK ADA perubahan visual.** Semua className Tailwind harus tetap identik. Jangan tambahkan efek baru.
2. **TIDAK ADA perubahan perilaku/logic.** Semua alur fetch, validasi, redirect, toggle, side effect harus 100% sama.
3. **Murni refactor struktural** — bukan rewrite atau tambah fitur.
4. **Jika menemukan bug**, JANGAN diperbaiki diam-diam — laporkan terpisah ke developer, biar developer yang putuskan.

### Urutan Refactoring (Bertahap)
Kerjakan satu per satu, pastikan tiap tahap tetap working:

1. **Ekstrak Types** → Pindahkan semua `interface`/`type` ke `types/namaFitur.types.ts`
2. **Ekstrak Service Layer** → Pindahkan semua `fetch`/API call ke `services/namaFiturService.ts`
3. **Ekstrak Custom Hook** → Pindahkan semua `useState`, `useEffect`, dan logic state ke `hooks/useNamaFitur.ts`
4. **Pecah Komponen UI** → Pecah JSX besar jadi sub-komponen kecil di `components/`
5. **Ekstrak Utils** (jika ada) → Fungsi murni (formatting, validasi, kalkulasi) ke `utils/`

### Target Page Utama Setelah Refactor
- Isi: hanya composisi/orchestration dari hooks + sub-komponen
- Ukuran: idealnya **di bawah 150-200 baris**
- Tidak ada logic bisnis langsung di page — semuanya delegasi ke hook/service

---

## 5. Aturan Kualitas Kode (Clean Code)

### TypeScript
- **HINDARI `any`** — gunakan tipe eksplisit. Jika tipe belum pasti, gunakan `unknown` + type narrowing.
- Semua props komponen WAJIB di-type lewat interface di file `*.types.ts` (bukan inline).
- Return type hook WAJIB eksplisit (atau minimal bisa di-infer dengan benar).
- Jangan definisikan type/interface yang sama berulang di banyak file — sentralkan di `*.types.ts`.

### Komponen React
- Satu komponen = satu tanggung jawab jelas (Single Responsibility).
- Satu hook = fokus satu concern (data fetching, UI state, dll).
- Hindari prop drilling berlebihan — pertimbangkan composition pattern atau context (tapi jangan over-engineer).
- Hindari duplikasi logic maupun duplikasi type antar sub-komponen.
- Komponen UI yang dipakai lintas fitur → taruh di `src/components/ui/`.
- Komponen layout (sidebar, navbar, dll) → taruh di `src/components/layout/`.

### Import Path
- Import shared components dengan relative path dari `src/components/`:
  ```ts
  import { PdfPreviewModal } from '../../../components/ui/pdf-preview-modal';
  ```
- Import internal fitur dengan relative path pendek:
  ```ts
  import { useVerification } from './hooks/useVerification';
  import { VerificationDocument } from './types/verification.types';
  ```
- Import halaman di `App.tsx` WAJIB mengarah langsung ke file `[Nama]Page.tsx`:
  ```ts
  // ✅ Direct import — WAJIB
  const Research = lazy(() => import('./pages/dosen/research/ResearchPage'));
  // ❌ Folder import via index — DILARANG
  const Research = lazy(() => import('./pages/dosen/research'));
  ```

---

## 6. Aturan Komentar Kode

- **Bahasa Indonesia**, singkat, dan hanya di bagian yang butuh penjelasan.
- Tulis komentar HANYA untuk:
  - Logic bisnis yang tidak jelas dari nama fungsi/variabel
  - Alasan di balik keputusan teknis tertentu
  - Workaround yang sengaja dibuat
- **JANGAN** komentari hal yang sudah jelas dari kodenya:
  ```ts
  // ❌ JANGAN seperti ini:
  // mengambil data user
  const userData = getUserData();
  
  // state untuk loading
  const [isLoading, setIsLoading] = useState(false);
  
  // ✅ Boleh seperti ini (menjelaskan kenapa, bukan apa):
  // Pakai sessionStorage bukan localStorage karena session harus expire saat tab ditutup
  const storedUser = sessionStorage.getItem('pentadosen_user');
  ```
- **JANGAN** pakai gaya komentar berlebihan/bertele-tele. Tulis seperti developer berpengalaman.
- Tidak perlu komentar di setiap fungsi — cukup di tempat yang menambah nilai.
- Hapus komentar lama yang sudah tidak relevan (TODO yang sudah selesai, komentar untuk kode yang sudah dihapus).

---

## 7. Shared Code & Cross-Feature Dependencies

### Lokasi Shared Code
| Jenis | Lokasi | Contoh |
|---|---|---|
| UI components reusable | `src/components/ui/` | `PdfPreviewModal`, `DatePicker`, `Button` |
| Layout components | `src/components/layout/` | `Layout`, `ScrollToTop` |
| Home/landing components | `src/components/Home/` | Hero section, landing page sections |
| Global utilities | `src/lib/utils.ts` | `cn()`, `buildDownloadFilename()`, `uploadWithProgress()` |

### Kapan Pindah ke Shared
- Jika sebuah komponen/fungsi dipakai oleh **2+ fitur berbeda** → pindah ke `src/components/ui/` atau `src/lib/`
- Jika HANYA dipakai 1 fitur → tetap di folder fitur tersebut

### Cross-Feature Import
- Boleh import antar fitur jika benar-benar diperlukan (misal: `pointsCalculator` dari `dashboard/` dipakai di `publication/`)
- Tapi jika terjadi terlalu sering, pertimbangkan memindahkan ke `src/lib/` atau `src/shared/`

---

## 8. Peta Status Refactoring

File-file yang perlu/sudah di-refactor:

### ✅ Sudah Refactored (Pakai sebagai reference/contoh)
| Fitur | Lokasi | Catatan |
|---|---|---|
| Admin Verification | `pages/admin/Verification/` | Pola lengkap: types, hooks, services, components |
| Admin Lecturers | `pages/admin/Lecturers/` | Pola lengkap + utils |
| Admin LecturerProfile | `pages/admin/LecturerProfile/` | Pola lengkap + utils |
| Admin CmsDashboard | `pages/admin/CmsDashboard/` | Pola lengkap |
| Admin ActivityLogs | `pages/admin/ActivityLogs/` | Pola lengkap + utils |

### ⚠️ Setengah Jalan (Sudah ada folder, tapi page masih besar/belum clean)
| Fitur | Lokasi | Ukuran | Masalah |
|---|---|---|---|
| Dosen Publication | `pages/dosen/publication/` | 36KB / 902 baris | Sudah ada components, tapi belum ada hooks/services/types terpisah |
| Dosen Research | `pages/dosen/research/` | 26KB | Sudah ada components, belum ada hooks/services/types |
| Dosen Buku | `pages/dosen/buku/` | 18KB | Sudah ada components + constants, belum ada hooks/services/types |
| Dosen HKI | `pages/dosen/hki/` | 19KB | Sama seperti buku |
| Dosen Dashboard | `pages/dosen/dashboard/` | 32KB | Ada hook & components tapi belum pakai pola types/services |

### ❌ Belum Refactored (Masih single file besar)
| Fitur | Lokasi | Ukuran | Prioritas |
|---|---|---|---|
| Admin Sync | `pages/admin/AdminSync.tsx` | **71KB** | 🔴 Tertinggi |
| Admin Input Document | `pages/admin/AdminInputDocument.tsx` | **58KB** | 🔴 Tinggi |
| Admin All Documents | `pages/admin/AdminAllDocuments.tsx` | **51KB** | 🔴 Tinggi |
| Dosen FaqHelp | `pages/dosen/FaqHelp.tsx` | **46KB** | 🟡 Sedang |

### ✅ Rename Selesai (index.tsx → NamaFiturPage.tsx)
Semua file `index.tsx` dan barrel `index.ts` sudah dihapus/direname:
- `Verification/index.tsx` → `Verification/VerificationPage.tsx` ✅
- `Lecturers/index.tsx` → `Lecturers/LecturersPage.tsx` ✅
- `LecturerProfile/index.tsx` → `LecturerProfile/LecturerProfilePage.tsx` ✅
- `CmsDashboard/index.tsx` → `CmsDashboard/CmsDashboardPage.tsx` ✅
- `ActivityLogs/index.tsx` → `ActivityLogs/ActivityLogsPage.tsx` ✅
- `publication/PublicationPage.tsx` — barrel `index.ts` dihapus ✅
- `research/ResearchPage.tsx` — barrel `index.ts` dihapus ✅
- `buku/BukuPage.tsx` — barrel `index.ts` dihapus ✅
- `hki/HKIPage.tsx` — barrel `index.ts` dihapus ✅
- `FaqHelp/FaqHelpPage.tsx` — barrel `index.ts` dihapus ✅
- `DepartementList/index.tsx` → `DepartementList/DepartementListPage.tsx` ✅
- `Insights/index.tsx` → `Insights/InsightsPage.tsx` ✅
- `LecturerList/index.tsx` → `LecturerList/LecturerListPage.tsx` ✅
- `LecturerProfileInsights/index.tsx` → `LecturerProfileInsights/LecturerProfileInsightsPage.tsx` ✅
- `auth/Login.tsx` → `auth/LoginPage.tsx` ✅
- `dosen/dashboard/LecturerDashboard.tsx` → `dosen/dashboard/LecturerDashboardPage.tsx` ✅
- `profilediri/Profile.tsx` → `profilediri/Profile/ProfilePage.tsx` ✅
- `profilediri/DetailInformasi.tsx` → `profilediri/DetailInformasi/DetailInformasiTab.tsx` ✅
- `profilediri/Konfigurasi.tsx` → `profilediri/Konfigurasi/KonfigurasiTab.tsx` ✅

Semua import di `App.tsx` sudah mengarah langsung ke file page (direct import, tanpa barrel).

---

## 9. Checklist Sebelum Commit (Self-Review)

Sebelum menganggap refactoring selesai, pastikan:

- [ ] Tidak ada perubahan visual (className Tailwind identik)
- [ ] Tidak ada perubahan perilaku (test manual fitur berjalan sama)
- [ ] Tidak ada `any` baru yang ditambahkan (kecuali memang sudah ada sebelumnya)
- [ ] Semua tipe terdefinisi di `*.types.ts`, bukan inline
- [ ] Page utama < 200 baris dan hanya orchestration
- [ ] Setiap komponen punya satu tanggung jawab jelas
- [ ] Tidak ada duplikasi type/interface antar file
- [ ] Import path benar dan konsisten
- [ ] Tidak ada file `index.tsx` maupun `index.ts` di folder fitur (gunakan `[NamaFitur]Page.tsx` + direct import)
- [ ] Komentar hanya di tempat yang menambah nilai, dalam Bahasa Indonesia
