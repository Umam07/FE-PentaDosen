# PentaDosen Design System

```yaml
version: 2.1
name: PentaDosen-design-system
description: |
  Sistem desain "warm-neutral academic" untuk PentaDosen 2.0 — platform manajemen KPI akademik,
  riset, analitik sitasi, dan Tri Dharma Universitas YARSI.

  Prinsip utamanya adalah warm neutral sebagai fondasi visual, ink sebagai warna kerja default,
  dan Royal Blue sebagai signature brand yang dipakai secara langka dan bermakna. Light mode
  menggunakan off-white hangat dan surface yang sangat berdekatan tonalitasnya agar halaman tidak
  terasa seperti kumpulan kartu putih dan abu-abu yang terpisah. Dark mode menggunakan warm espresso / deep coffee
  yang elegan, berkelas, dan nyaman di mata: bukan hitam pekat, bukan abu-abu kebiruan, dan bukan beige
  yang berlebihan.

  Warna semantik hijau, oranye, dan merah hanya digunakan ketika ada makna status. Warna chart
  Scopus dan Google Scholar merupakan pengecualian terkontrol karena mewakili identitas sumber data.
  Tidak ada warna dekoratif yang ditambahkan hanya untuk membuat dashboard terasa lebih ramai.

colors:
  # ================================================================
  # INK — warna kerja utama dashboard
  # ================================================================
  ink: "#191918"
  ink-hover: "#2c2b29"
  ink-active: "#11110f"
  ink-soft: "#efeeea"
  ink-border: "#d9d6d0"
  ink-disabled: "#aaa69f"
  on-ink: "#ffffff"

  # ================================================================
  # ACCENT — Royal Blue, brand signature yang langka
  # ================================================================
  accent: "#2563eb"
  accent-hover: "#1d4ed8"
  accent-active: "#1e40af"
  accent-soft: "#eff6ff"
  accent-border: "#bfdbfe"
  accent-on-dark: "#7ea7ff"

  # ================================================================
  # CANVAS & SURFACE — LIGHT / WARM NEUTRAL
  # ================================================================
  canvas-light: "#f7f7f5"
  surface-light: "#fbfaf8"
  surface-light-raised: "#f0efec"
  hairline-light: "#dedcd7"
  hairline-light-soft: "#e9e7e2"

  # ================================================================
  # CANVAS & SURFACE — DARK / WARM ESPRESSO
  # ================================================================
  canvas-dark: "#171412"
  surface-dark: "#201b17"
  surface-dark-elevated: "#2a241f"
  surface-dark-soft: "#1b1714"
  hairline-dark: "#38312a"
  hairline-dark-soft: "#2c2621"
  footer-dark: "#110e0c"

  # ================================================================
  # TEXT
  # ================================================================
  ink-heading: "#191918"
  body: "#45433f"
  body-strong: "#292824"
  muted: "#74716b"
  muted-soft: "#9a9690"
  on-dark: "#ece4db"
  on-dark-soft: "#cfc5ba"
  on-dark-muted: "#9d9285"

  # ================================================================
  # SEMANTIC — status only, never decorative
  # ================================================================
  success: "#3f8f5f"
  success-soft: "#edf7f0"
  success-border: "#cae5d2"
  success-dark: "#2f6f48"
  success-on-dark: "#75c995"

  warning: "#c7832f"
  warning-soft: "#fff7ea"
  warning-border: "#f3d6a7"
  warning-on-dark: "#e9b45e"

  error: "#c94a4a"
  error-soft: "#fceeee"
  error-border: "#efcaca"
  error-on-dark: "#f28b8b"

  info-purple: "#7c5cf0"

  # ================================================================
  # CHART / ANALYTICS — controlled exceptions
  # ================================================================
  chart-scopus: "#d9823b"
  chart-scopus-dark: "#efa466"
  chart-scholar: "#4a78d0"
  chart-scholar-dark: "#86a8e5"
  chart-neutral-line: "#858078"

typography:
  # UI: IBM Plex Sans — institusional, presisi, nyaman untuk dashboard akademik.
  # Data/Kode: JetBrains Mono — angka KPI, metadata teknis, kode, status API.

  display-xl:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 60px
    fontWeight: 700
    lineHeight: 1.08
    letterSpacing: -1.4px
    useCase: "Hero H1 homepage publik — satu-satunya tempat display-xl dipakai"

  display-lg:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 44px
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: -1.0px
    useCase: "Judul section utama landing page"

  display-md:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 34px
    fontWeight: 600
    lineHeight: 1.18
    letterSpacing: -0.6px
    useCase: "Judul drawer, H1 halaman Developers, lead section besar"

  display-sm:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: -0.3px
    useCase: "Judul utama bento card, heading modal utama"

  title-lg:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.1px
    useCase: "Judul leaderboard, sub-heading fitur bento"

  title-md:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 17px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
    useCase: "Judul kartu, nama dosen, judul grup filter"

  title-sm:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
    useCase: "Label field form, header tabel, header item list"

  body-lg:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    useCase: "Subtitle hero, paragraf pembuka ringkasan"

  body-md:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
    useCase: "Body copy default, teks artikel, deskripsi dialog"

  body-sm:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
    useCase: "Penjelasan feature card, nilai sel tabel, teks footer"

  caption:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
    useCase: "Metadata sekunder, label institusi, bio penulis"

  caption-uppercase:
    fontFamily: "JetBrains Mono, IBM Plex Sans, monospace"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 1.2px
    useCase: 'Pill tag monospace ("AUTOMATED API SYNC", "LIVE SYNC MONITOR")'

  code:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
    useCase: "Angka metrik, nama file (.xlsx, .pdf), status API"

  button:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: 0
    useCase: "Label tombol aksi, CTA, trigger interaktif"

  nav-link:
    fontFamily: "IBM Plex Sans, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
    useCase: "Tautan navbar mengambang, item menu sidebar"

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 10px
  xl: 14px
  2xl: 18px
  3xl: 22px
  pill: 9999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 96px

components:
  # ================================================================
  # BUTTONS
  # ================================================================
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 12px 22px
    height: 44px

  button-primary-hover:
    backgroundColor: "{colors.ink-hover}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.lg}"

  button-primary-active:
    backgroundColor: "{colors.ink-active}"
    textColor: "{colors.on-ink}"
    rounded: "{rounded.lg}"

  button-hero-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.on-ink}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 12px 24px
    height: 46px

  button-hero-accent-hover:
    backgroundColor: "{colors.accent-hover}"

  button-secondary-light:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.ink-heading}"
    border: "1px solid {colors.hairline-light}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 12px 22px
    height: 44px

  button-secondary-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    border: "1px solid {colors.hairline-dark}"
    typography: "{typography.button}"
    rounded: "{rounded.lg}"
    padding: 12px 22px
    height: 44px

  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.muted}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 8px 14px

  button-icon-light:
    backgroundColor: "{colors.surface-light-raised}"
    textColor: "{colors.ink-heading}"
    rounded: "{rounded.lg}"
    size: 40px

  button-icon-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.lg}"
    size: 40px

  # ================================================================
  # NAVIGATION
  # ================================================================
  top-floating-navbar:
    backgroundColor: "rgba(251, 250, 248, 0.82)"
    darkBackgroundColor: "rgba(33, 31, 28, 0.82)"
    backdropBlur: "16px"
    border: "1px solid rgba(25, 25, 24, 0.07)"
    darkBorder: "1px solid rgba(237, 232, 225, 0.08)"
    rounded: "{rounded.2xl}"
    height: 64px

  sidebar-active:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.on-ink}"
    activeIndicatorColor: "{colors.accent}"
    rounded: "{rounded.lg}"

  # ================================================================
  # PAGE / CONTAINERS
  # ================================================================
  hero-section:
    backgroundColor: "{colors.canvas-light}"
    darkBackgroundColor: "{colors.canvas-dark}"
    padding: 96px

  dashboard-page:
    backgroundColor: "{colors.canvas-light}"
    darkBackgroundColor: "{colors.canvas-dark}"

  bento-feature-card:
    backgroundColor: "{colors.surface-light}"
    darkBackgroundColor: "{colors.surface-dark}"
    border: "1px solid {colors.hairline-light}"
    darkBorder: "1px solid {colors.hairline-dark}"
    rounded: "{rounded.3xl}"
    padding: 32px

  primary-container:
    backgroundColor: "{colors.surface-light}"
    darkBackgroundColor: "{colors.surface-dark}"
    border: "1px solid {colors.hairline-light}"
    darkBorder: "1px solid {colors.hairline-dark}"
    rounded: "{rounded.3xl}"

  # ================================================================
  # ICONS / BADGES
  # ================================================================
  icon-badge-neutral-light:
    backgroundColor: "{colors.ink-soft}"
    iconColor: "{colors.body}"
    rounded: "{rounded.lg}"
    size: 40px

  icon-badge-neutral-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    iconColor: "{colors.on-dark-soft}"
    rounded: "{rounded.lg}"
    size: 40px

  badge-pill-verified:
    backgroundColor: "{colors.success-soft}"
    textColor: "{colors.success-dark}"
    darkBackgroundColor: "rgba(63, 143, 95, 0.16)"
    darkTextColor: "{colors.success-on-dark}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px

  badge-pill-pending:
    backgroundColor: "{colors.warning-soft}"
    textColor: "{colors.warning}"
    darkBackgroundColor: "rgba(199, 131, 47, 0.16)"
    darkTextColor: "{colors.warning-on-dark}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px

  badge-pill-error:
    backgroundColor: "{colors.error-soft}"
    textColor: "{colors.error}"
    darkBackgroundColor: "rgba(201, 74, 74, 0.16)"
    darkTextColor: "{colors.error-on-dark}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.pill}"
    padding: 4px 10px

  badge-pill-neutral-light:
    backgroundColor: "{colors.ink-soft}"
    textColor: "{colors.body}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.lg}"
    padding: 6px 12px

  badge-pill-neutral-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    textColor: "{colors.on-dark-soft}"
    typography: "{typography.caption-uppercase}"
    rounded: "{rounded.lg}"
    padding: 6px 12px

  # ================================================================
  # METRICS / ANALYTICS
  # ================================================================
  metric-card-light:
    backgroundColor: "{colors.surface-light-raised}"
    border: "1px solid {colors.hairline-light-soft}"
    rounded: "{rounded.xl}"

  metric-card-dark:
    backgroundColor: "{colors.surface-dark-elevated}"
    border: "1px solid {colors.hairline-dark-soft}"
    rounded: "{rounded.xl}"

  live-sync-monitor-card:
    backgroundColor: "{colors.surface-dark-soft}"
    darkBackgroundColor: "{colors.canvas-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code}"
    border: "1px solid {colors.hairline-dark}"
    rounded: "{rounded.2xl}"
    padding: 16px

  leaderboard-container:
    backgroundColor: "{colors.surface-light}"
    darkBackgroundColor: "{colors.surface-dark}"
    rounded: "{rounded.3xl}"
    border: "1px solid {colors.hairline-light}"
    darkBorder: "1px solid {colors.hairline-dark}"
    padding: 32px

  contribution-bar:
    trackBackgroundColorLight: "{colors.surface-light-raised}"
    trackBackgroundColorDark: "{colors.surface-dark-elevated}"
    internalColor: "{colors.chart-scopus}"
    externalColor: "{colors.accent}"
    height: 8px
    rounded: "{rounded.pill}"

  # ================================================================
  # DATA TABLE / INPUT
  # ================================================================
  table-row:
    backgroundColor: transparent
    hoverBackgroundColor: "{colors.surface-light-raised}"
    darkHoverBackgroundColor: "{colors.surface-dark-elevated}"
    padding: 16px 20px
    borderBottom: "1px solid {colors.hairline-light}"
    darkBorderBottom: "1px solid {colors.hairline-dark-soft}"

  text-input-light:
    backgroundColor: "{colors.surface-light}"
    textColor: "{colors.ink-heading}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline-light}"
    padding: 10px 16px
    height: 44px

  text-input-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.hairline-dark}"
    padding: 10px 16px
    height: 44px

  text-input-focused:
    borderColor: "{colors.accent}"
    ring: "3px solid rgba(37, 99, 235, 0.15)"

  # ================================================================
  # FOOTER
  # ================================================================
  footer:
    backgroundColor: "{colors.footer-dark}"
    textColor: "{colors.muted}"
    typography: "{typography.body-sm}"
    borderTop: "1px solid #302c27"
    padding: 80px
```

## Overview

**PentaDosen 2.0** adalah platform manajemen KPI akademik, analitik sitasi, dan Tri Dharma milik **Universitas YARSI**, dikembangkan oleh **Tim DUK**.

Versi desain ini memilih satu arah visual yang konsisten: **Warm Neutral Academic**. Tujuannya bukan membuat dashboard terasa krem atau dekoratif, tetapi menciptakan antarmuka yang tenang, hangat, premium, dan mudah dibaca untuk penggunaan panjang.

Masalah utama versi sebelumnya adalah adanya dua arah palette yang bercampur: clean cool neutral pada satu bagian dan warm Claude-inspired pada bagian lain. Versi 4.0 menyatukannya menjadi satu sumber kebenaran.

**Prinsip inti:**

1. **Warm neutral adalah fondasi.** Canvas dan surface harus berada dalam keluarga warna yang sama. Perbedaan layer dibuat lewat perubahan brightness yang halus, bukan kontras putih-versus-abu yang tajam.
2. **Ink adalah warna kerja default.** Tombol primary, item dashboard aktif, dan kontrol utama menggunakan `#191918`, bukan biru.
3. **Biru adalah tanda tangan brand.** `#2563eb` digunakan secara langka untuk logo, link, satu CTA hero homepage, indikator aktif sidebar, focus ring, dan konteks analitik yang memang membutuhkan identitas sumber.
4. **Status tetap semantik.** Hijau berarti berhasil/terverifikasi/tersinkron, oranye berarti menunggu/perlu konfirmasi, merah berarti error/ditolak.
5. **Dark mode memakai warm espresso / deep coffee.** Tidak menggunakan black murni, slate kebiruan, atau abu-abu dingin. Kedalaman dibangun dari beberapa level cokelat kopi gelap yang hangat.
6. **Restraint adalah fitur.** Jangan menambahkan warna hanya agar dashboard terlihat hidup. Gunakan warna ketika pengguna memang perlu menginterpretasikannya.

## Colors

### Warm Neutral Light

- **Canvas** (`{colors.canvas-light}` — `#f7f7f5`): latar utama halaman.
- **Surface** (`{colors.surface-light}` — `#fbfaf8`): kartu utama, container, modal, dan area konten.
- **Surface Raised** (`{colors.surface-light-raised}` — `#f0efec`): sub-card, metric tile, icon badge, selector, dan layer yang perlu sedikit lebih gelap dari surface utama.
- **Hairline** (`{colors.hairline-light}` — `#dedcd7`): border utama.
- **Hairline Soft** (`{colors.hairline-light-soft}` — `#e9e7e2`): divider yang sangat halus.

**Aturan:** hindari penggunaan `#ffffff` sebagai background besar. Pure white hanya boleh muncul sebagai elemen kecil yang memang membutuhkan kontras tambahan, misalnya overlay atau kontrol tertentu. Kartu utama default menggunakan `{colors.surface-light}`.

### Warm Espresso Dark

- **Canvas Dark** (`{colors.canvas-dark}` — `#171412`): background halaman utama.
- **Surface Dark** (`{colors.surface-dark}` — `#201b17`): container/kartu utama.
- **Surface Dark Elevated** (`{colors.surface-dark-elevated}` — `#2a241f`): sub-card, dropdown, metric tile, modal layer, dan hover state yang membutuhkan elevasi lebih tinggi.
- **Surface Dark Soft** (`{colors.surface-dark-soft}` — `#1b1714`): surface yang hanya sedikit lebih terang dari canvas.
- **Hairline Dark** (`{colors.hairline-dark}` — `#38312a`): border utama.
- **Hairline Dark Soft** (`{colors.hairline-dark-soft}` — `#2c2621`): divider yang halus.
- **Footer Dark** (`{colors.footer-dark}` — `#110e0c`): footer atau area paling gelap.

**Aturan:** jangan menggunakan `#000000` atau slate blue untuk canvas. Dark mode harus terasa seperti warm espresso yang kaya dan nyaman di mata, bukan terminal hitam.

### Ink

- **Ink** (`{colors.ink}` — `#191918`): primary action dan interactive default.
- **Ink Hover** (`{colors.ink-hover}` — `#2c2b29`).
- **Ink Active** (`{colors.ink-active}` — `#11110f`).
- **Ink Soft** (`{colors.ink-soft}` — `#efeeea`): icon badge neutral/chip.
- **Ink Border** (`{colors.ink-border}` — `#d9d6d0`).

### Accent — Royal Blue

- **Accent** (`{colors.accent}` — `#2563eb`): warna brand PentaDosen.
- **Accent Hover** (`{colors.accent-hover}` — `#1d4ed8`).
- **Accent Active** (`{colors.accent-active}` — `#1e40af`).
- **Accent Soft** (`{colors.accent-soft}` — `#eff6ff`).
- **Accent Border** (`{colors.accent-border}` — `#bfdbfe`).
- **Accent On Dark** (`{colors.accent-on-dark}` — `#7ea7ff`): versi lebih lembut untuk dark mode.

### Teks

- **Heading** (`{colors.ink-heading}` — `#191918`).
- **Body** (`{colors.body}` — `#45433f`).
- **Body Strong** (`{colors.body-strong}` — `#292824`).
- **Muted** (`{colors.muted}` — `#74716b`).
- **Muted Soft** (`{colors.muted-soft}` — `#9a9690`).
- **On Dark** (`{colors.on-dark}` — `#ece4db`): off-white hangat untuk teks utama dark mode.
- **On Dark Soft** (`{colors.on-dark-soft}` — `#cfc5ba`).
- **On Dark Muted** (`{colors.on-dark-muted}` — `#9d9285`).

Gunakan off-white untuk teks dark mode dan jangan menaruh body text putih murni di atas warm dark surface kecuali ada alasan aksesibilitas yang jelas.

### Semantik

- **Success** → `{colors.success}` `#3f8f5f`.
- **Warning** → `{colors.warning}` `#c7832f`.
- **Error** → `{colors.error}` `#c94a4a`.
- **Info Purple** → `{colors.info-purple}` `#7c5cf0`, khusus klasifikasi HKI/Paten jika memang dibutuhkan.

Di dark mode, gunakan varian `-on-dark` atau surface semantik transparan. Jangan reuse warna light mode yang terlalu jenuh langsung di atas warm dark surface.

### Chart & Analitik

Warna chart adalah pengecualian yang disengaja karena membantu pengguna membedakan sumber data:

- **Scopus** → `{colors.chart-scopus}` `#d9823b`.
- **Google Scholar** → `{colors.chart-scholar}` `#4a78d0`.
- **Neutral comparison line** → `{colors.chart-neutral-line}` `#858078`.

Varian dark mode:

- Scopus → `{colors.chart-scopus-dark}` `#efa466`.
- Google Scholar → `{colors.chart-scholar-dark}` `#86a8e5`.

Warna chart tidak boleh bocor ke tombol, badge generik, atau icon UI yang tidak berhubungan dengan sumber data.

## Warm Neutral Hierarchy

Tujuan utama palette baru adalah menghindari pola visual:

`abu-abu → putih → abu-abu → putih`

yang membuat dashboard terasa seperti kumpulan kartu terpisah.

Gunakan hirarki berikut:

**Light mode**

`Canvas #f7f7f5` → `Surface #fbfaf8` → `Raised #f0efec`

**Dark mode**

`Canvas #211f1c` → `Surface #28251f` → `Elevated #332f28`

Perbedaan warna harus terasa halus ketika dilihat sekilas. Pengguna seharusnya menangkap struktur dan hierarchy, bukan memikirkan “ini kartu warna apa?”.

## Typography

### Kenapa IBM Plex Sans

IBM Plex Sans dipertahankan untuk seluruh UI karena karakternya presisi dan institusional tanpa terasa terlalu generik. Ini cocok untuk dashboard KPI, tabel, metadata akademik, dan konten yang perlu dibaca berulang.

### Data & Code

JetBrains Mono dipertahankan untuk angka KPI, kode, ID, nama file, dan status API. Gunakan hanya ketika sifat data/teknis memang membutuhkan pembeda visual.

### Hierarki

| Token                            | Ukuran | Weight | Line Height | Letter Spacing | Kegunaan                         |
| -------------------------------- | -----: | -----: | ----------: | -------------: | -------------------------------- |
| `{typography.display-xl}`        |   60px |    700 |        1.08 |         -1.4px | Hero H1 homepage publik          |
| `{typography.display-lg}`        |   44px |    700 |        1.12 |         -1.0px | Judul section utama landing page |
| `{typography.display-md}`        |   34px |    600 |        1.18 |         -0.6px | Drawer title, H1 Developers      |
| `{typography.display-sm}`        |   26px |    600 |        1.25 |         -0.3px | Judul utama bento/card           |
| `{typography.title-lg}`          |   20px |    600 |        1.30 |         -0.1px | Leaderboard, sub-heading         |
| `{typography.title-md}`          |   17px |    600 |        1.40 |            0px | Nama dosen, judul kartu          |
| `{typography.title-sm}`          |   15px |    600 |        1.40 |            0px | Label field, header tabel        |
| `{typography.body-lg}`           |   17px |    400 |        1.60 |            0px | Subtitle / intro                 |
| `{typography.body-md}`           |   15px |    400 |        1.60 |            0px | Body default                     |
| `{typography.body-sm}`           |   13px |    400 |        1.55 |            0px | Metadata, table cell             |
| `{typography.caption}`           |   12px |    500 |        1.40 |            0px | Metadata sekunder                |
| `{typography.caption-uppercase}` |   11px |    600 |        1.40 |          1.2px | Status/tag teknis                |
| `{typography.code}`              |   13px |    500 |        1.50 |            0px | Angka, ID, kode                  |
| `{typography.button}`            |   14px |    600 |        1.00 |            0px | Tombol                           |
| `{typography.nav-link}`          |   14px |    600 |        1.40 |            0px | Sidebar/navbar                   |

### Aturan Praktis

- ≥26px: line-height ketat + letter-spacing negatif.
- 15–20px: line-height 1.3–1.4, tracking netral.
- ≤17px: line-height 1.55–1.6 untuk kenyamanan baca.
- Body dan metadata jangan dibuat terlalu tipis pada light mode maupun dark mode.

## Layout

### Spacing System

Base unit 4px:

`4px · 8px · 12px · 16px · 24px · 32px · 48px · 96px`

### Grid & Max Container

- **Max Width:** `max-w-7xl` (~1280px) untuk section marketing & bento.
- **Topbar / area lebar:** sampai `max-w-[1600px]` jika dibutuhkan oleh viewport besar.
- **Bento Grid:** 12 kolom (`md:grid-cols-12`).
- Jangan menambah whitespace besar hanya karena palette lebih minimal; gunakan spacing system sebagai struktur utama.

## Elevation & Depth

| Level      | Light Mode                              | Dark Mode                          | Kegunaan           |
| ---------- | --------------------------------------- | ---------------------------------- | ------------------ |
| 0 Flat     | `{colors.canvas-light}`                 | `{colors.canvas-dark}`             | Background halaman |
| 1 Card     | Border 1px hairline + `shadow-sm`       | Border 1px dark hairline           | Card/container     |
| 2 Hover    | Border ink-border + `shadow-md`         | Border dark hairline + `shadow-lg` | Interactive card   |
| 3 Floating | Warm off-white translucent + blur       | Warm espresso translucent + blur   | Sticky navbar      |
| 4 Modal    | `{colors.surface-light}` + `shadow-2xl` | `{colors.surface-dark}` + border   | Modal/drawer       |

**Catatan:** gunakan shadow secara hemat. Warm-neutral system mengandalkan perubahan surface dan border lebih banyak daripada shadow berat.

## Shapes

| Token            |  Nilai | Diterapkan Pada               |
| ---------------- | -----: | ----------------------------- |
| `{rounded.xs}`   |    4px | Status inline, mini tag       |
| `{rounded.sm}`   |    6px | Sub-tab, selector kecil       |
| `{rounded.md}`   |    8px | Dropdown trigger              |
| `{rounded.lg}`   |   10px | Tombol, input, action control |
| `{rounded.xl}`   |   14px | Search, avatar card           |
| `{rounded.2xl}`  |   18px | Floating navbar               |
| `{rounded.3xl}`  |   22px | Primary container, bento card |
| `{rounded.pill}` | 9999px | Status badge                  |
| `{rounded.full}` | 9999px | Avatar/icon circular          |

Radius tombol tetap 10px. Jangan menggunakan pill radius untuk tombol utama.

## Components

### Tombol Primary

Height 44px, padding `12px 22px`, rounded 10px, background `{colors.ink}`. Semua aksi utama dashboard menggunakan pola ini tanpa variasi warna dekoratif.

### Tombol Hero Accent

Biru hanya untuk satu CTA paling penting di homepage/landing page publik. Tidak digunakan sebagai warna tombol default setelah login.

### Sidebar Active

Background tetap ink. Royal Blue digunakan sebagai indikator aktif yang kecil dan tegas, bukan sebagai background seluruh item jika tidak diperlukan.

### Badge Icon Neutral

Semua icon statistik generik menggunakan badge netral. Jangan membedakan warna icon hanya untuk membuat dashboard lebih hidup.

### Badge Status

- Verified / synced → hijau.
- Pending / action needed → oranye.
- Error / rejected → merah.

Badge status harus memiliki background tint yang sangat halus pada light mode dan translucent surface pada dark mode.

### Metric Card

Gunakan `{colors.surface-light-raised}` pada light mode dan `{colors.surface-dark-elevated}` pada dark mode. Metric card tidak boleh menjadi biru kecuali angka/indikatornya memang link atau state interaktif.

### Google Scholar / Scopus Card

Card identitas sumber tetap berada di keluarga warm neutral. Warna sumber muncul di chart, legend, atau titik identitas yang memang membantu scanning. Background card tidak berubah menjadi biru/oranye penuh.

### Table

Table row default transparan. Hover menggunakan raised surface. Divider menggunakan hairline soft. Jangan menggunakan zebra striping yang kontras tinggi kecuali dataset sangat padat dan usability membutuhkannya.

### Inputs

Input light menggunakan surface hampir putih hangat. Input dark menggunakan surface espresso/dark coffee yang sedikit lebih terang dari canvas. Focus ring menggunakan accent blue dengan opacity rendah.

## Icon Color Rules

Gunakan tiga tingkat:

1. **Icon status** → semantic color.
2. **Icon statistik generik** → neutral.
3. **Icon identitas sumber data** → source-specific color hanya ketika konteksnya memang sumber data.

Tidak ada rainbow icons.

## Color Usage Budget

Gunakan pendekatan visual berikut sebagai default:

- **~70%** warm neutral surfaces/backgrounds.
- **~20%** ink/text/borders.
- **~8%** semantic/status atau chart colors sesuai konteks.
- **~2%** Royal Blue brand accent.

Angka ini adalah panduan visual, bukan aturan matematika. Tujuannya menjaga restraint.

## Accessibility & Technical Standards (WCAG 2.1 AA & Axe Core Compliance)

Seluruh halaman dan komponen PentaDosen **WAJIB** memenuhi standar aksesibilitas WCAG 2.1 AA (Skor 100 di PageSpeed Insights / Lighthouse / Axe Core). Ikuti aturan teknis berikut saat membuat atau merefaktor UI:

### 1. Struktur Semantik & Landmark Wajib (`landmark-one-main`)
- **Main Landmark:** Setiap file halaman utama (orchestrator page) **WAJIB** membungkus area konten utamanya di dalam tag `<main id="main-content">`.
- **Header & Footer:** Navigasi atas dibungkus `<header>` atau `<nav>`, footer dibungkus `<footer>`.
- **Accessible Skip Link:** Sertakan tombol skip-to-content tersembunyi (`sr-only focus:not-sr-only`) di bagian atas page untuk pengguna keyboard/screen reader:
  ```tsx
  <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-accent focus:text-white focus:rounded-lg focus:shadow-lg">
    Lewati ke Konten Utama
  </a>
  ```

### 2. Urutan Hierarki Heading (`heading-order`)
- **Jangan melompati level heading:** Urutan heading harus berjenjang menurun secara berurutan (`<h1>` → `<h2>` → `<h3>` → `<h4>`). Dilarang melompat langsung dari `<h2>` ke `<h4>`.
- **Satu `<h1>` per halaman:** Hanya gunakan satu tag `<h1>` untuk judul utama/headline halaman.
- **Section & Cards:** Judul section besar menggunakan `<h2>`, kartu fitur/widget menggunakan `<h3>`, dan sub-elemen/label kartu menggunakan `<h4>` atau `<p className="font-bold ...">`.

### 3. Rasio Kontras Warna Teks (Minimum 4.5:1 untuk Teks Normal, 3:1 untuk Teks Besar)
- **Teks Normal (< 18px / < 14px bold):** Wajib memiliki rasio kontras minimal **4.5:1** terhadap latar belakangnya.
- **Teks Besar (≥ 18px / ≥ 14px bold) & Komponen UI:** Wajib memiliki rasio kontras minimal **3.0:1**.
- **Aturan Pemakaian Token Kontras:**
  - Latar Terang (`canvas-light` / `surface-light` / `surface-light-raised`):
    - Gunakan `text-ink-heading` (`#191918`) atau `text-body-strong` (`#201f1c`) untuk teks primer & judul (kontras > 12:1).
    - Gunakan `text-body` (`#3c3a37`) untuk teks sekunder/deskripsi (kontras > 9:1).
    - Gunakan `text-muted` (`#54524d`) untuk teks metadata/sub-teks (kontras > 6.2:1).
    - **DILARANG** menggunakan teks dengan opasitas rendah (misal `opacity-40`, `text-muted-soft` tanpa dark variant) pada teks informatif atau angka metrik.
  - Latar Gelap (`canvas-dark` / `surface-dark` / `surface-dark-elevated`):
    - Gunakan `text-on-dark` (`#ece4db`) untuk teks primer (kontras > 14:1).
    - Gunakan `text-on-dark-soft` (`#d8cfc5`) untuk teks sekunder (kontras > 9:1).
    - Gunakan `text-on-dark-muted` (`#b8ada0`) untuk metadata (kontras > 6.4:1).
  - Teks Semantik pada Background Tint Lembut:
    - Status sukses pada badge `bg-success-soft`: gunakan `text-success-dark` / `text-success` (`#15693b` / `#125430`), jangan teks hijau muda pucat.
    - Status warning pada badge `bg-warning-soft`: gunakan `text-warning` (`#945400`), jangan kuning terang.
    - Tautan/tombol biru pada `bg-accent/10` atau `bg-accent/15`: gunakan `text-accent-hover` (`#1d4ed8`) di light mode dan `text-accent-on-dark` (`#7ea7ff`) di dark mode.

### 4. Tombol Interaktif, Tautan & Form (`interactive-a11y`)
- **Nama Aksesibel Tombol:** Semua tombol yang hanya menampilkan ikon (misal: ThemeToggle, tombol filter, tombol copy, tombol hapus) **WAJIB** memiliki atribut `aria-label` yang deskriptif.
- **Tautan Eksternal:** Seluruh `target="_blank"` wajib menyertakan `rel="noopener noreferrer"`.
- **Target Sentuh Minimum:** Elemen interaktif harus memiliki area sentuh minimal 40x40px atau padding yang memadai (`p-2.5` / `p-3`).
- **Focus Ring / Indikator Fokus:** Pertahankan outline fokus (`focus-visible:ring-2 focus-visible:ring-accent`) untuk navigasi keyboard yang jelas.

### 5. Aksesibilitas Gerak & Animasi (`prefers-reduced-motion`)
- Seluruh animasi looping/infinite (seperti ping dot, spinner, sheen sweep) **WAJIB** menghormati preferensi gerak pengguna:
  - Gunakan class `motion-reduce:hidden` atau `motion-reduce:animate-none` pada CSS animasi berulang.
  - Gunakan `useReducedMotion()` dari `motion/react` saat mengontrol animasi angka bertambah (`CountUp`) atau transisi berat.

## Do's

- Gunakan `{colors.canvas-light}` untuk halaman light mode.
- Gunakan `{colors.surface-light}` untuk primary container.
- Gunakan `{colors.surface-light-raised}` untuk sub-card/metric tile.
- Gunakan `{colors.canvas-dark}` → `{colors.surface-dark}` → `{colors.surface-dark-elevated}` untuk hierarchy dark mode.
- Gunakan `{colors.ink}` untuk tombol primary dashboard.
- Gunakan Royal Blue hanya pada titik yang memang membutuhkan signature brand atau interaksi.
- Gunakan semantic colors hanya saat ada makna semantic.
- Gunakan varian dark untuk chart dan status agar tidak menyala.
- Gunakan border hairline dan shadow lembut untuk separation.
- Pertahankan IBM Plex Sans + JetBrains Mono secara konsisten.

## Don'ts

- Jangan campur palette cool-neutral dengan warm-neutral.
- Jangan menggunakan `#ffffff` sebagai background semua card.
- Jangan membuat setiap sub-card memiliki warna abu-abu yang berbeda-beda tanpa fungsi.
- Jangan memakai biru sebagai warna default seluruh dashboard.
- Jangan memakai chart colors di tombol atau icon generik.
- Jangan menggunakan black `#000000` untuk canvas dark.
- Jangan menggunakan slate/blue-gray sebagai dark surface.
- Jangan membuat dark mode menjadi beige terang; warm dark harus tetap netral, hangat, dan tenang.
- Jangan menggunakan pill radius untuk tombol aksi.
- Jangan mencampur Inter/Plus Jakarta Sans dengan IBM Plex Sans.

## Responsive Behavior

| Breakpoint   | Lebar       | Perubahan                                                                    |
| ------------ | ----------- | ---------------------------------------------------------------------------- |
| Mobile       | <768px      | Sidebar/navbar menjadi drawer, padding mengecil, bento 1 kolom               |
| Tablet       | 768–1024px  | Bento 2 kolom atau 6/6, top navigation lebih ringkas                         |
| Desktop      | 1024–1440px | Layout dashboard penuh, bento 12 kolom                                       |
| Wide Desktop | >1440px     | Area topbar/leaderboard dapat melebar, konten utama tetap memiliki max width |

## Theme Switching

### Light Mode

Prioritas visual:

`Warm Canvas → Warm Surface → Raised Surface → Ink → Accent`

### Dark Mode

Prioritas visual:

`Warm Charcoal Canvas → Warm Charcoal Surface → Elevated Surface → Off-white Text → Muted Accent`

Saat berpindah theme, struktur komponen tetap sama. Hanya warna, shadow/elevation, dan tingkat kontras yang berubah.

## Implementation Rules

1. Referensikan token dengan format `{colors.*}`, `{typography.*}`, `{rounded.*}`, `{spacing.*}`.
2. Hindari hardcoded color di komponen bila token tersedia.
3. Komponen baru default-nya neutral terlebih dahulu.
4. Sebelum menambahkan warna, tanyakan: apakah warna tersebut menyampaikan informasi atau hanya dekorasi?
5. Bila dekorasi saja, jangan gunakan.
6. Untuk dark mode, jangan copy-paste warna light mode.
7. Gunakan surface hierarchy sebelum menggunakan shadow tambahan.
8. Pastikan card yang sefungsi memakai token surface yang sama agar UI terasa satu sistem.
9. Bila warna brand muncul di lebih dari satu lokasi, pastikan setiap kemunculannya punya alasan yang jelas.

## Page-Specific Guidance: Dashboard Poin

Untuk halaman Dashboard Poin seperti screenshot utama:

- Body background → `{colors.canvas-light}` / `{colors.canvas-dark}`.
- Profile container → `{colors.surface-light}` / `{colors.surface-dark}`.
- KPI metric cards → `{colors.surface-light-raised}` / `{colors.surface-dark-elevated}`.
- Google Scholar / Scopus cards → gunakan surface yang sama, bukan warna brand sebagai background.
- Status “Tersinkron” → success semantic.
- Contribution bar → gunakan warna sumber data atau kategori yang bermakna; jangan memakai warna dekoratif tambahan.
- Tabs → neutral; active state boleh menggunakan ink atau accent indicator kecil.
- Angka KPI → JetBrains Mono bila memang membutuhkan karakter data/metric.
- Judul dosen → IBM Plex Sans, title hierarchy.

**Tujuan visual halaman:** pengguna harus fokus pada angka, status, sumber data, dan tren — bukan pada warna kartu.

## Design Philosophy

PentaDosen bukan produk finansial, bukan social media, dan bukan gaming dashboard. Visualnya harus menunjukkan:

**akademik + data-heavy + trustworthy + calm + modern.**

Warm Neutral dipilih untuk mengurangi rasa dingin dari dashboard korporat dan menghindari visual yang terlalu kontras. Royal Blue tetap menjaga identitas PentaDosen tanpa mengharuskan seluruh UI menjadi biru.

Prinsip akhirnya sederhana:

> **Make the interface quiet, so the academic data can speak.**

## Iteration Guide

1. Saat menambah komponen, mulai dari warm neutral.
2. Pilih surface berdasarkan hierarchy, bukan berdasarkan preferensi warna per komponen.
3. Gunakan ink untuk action default.
4. Gunakan accent blue hanya pada titik yang punya fungsi brand/interaksi.
5. Gunakan semantic color hanya untuk status.
6. Gunakan chart color hanya untuk representasi sumber data.
7. Cek light dan dark mode setiap kali menambah warna baru.
8. Bila sebuah layar terasa terlalu datar, perbaiki hierarchy, spacing, typography, border, atau elevation sebelum menambahkan warna.
9. Bila sebuah layar terasa terlalu ramai, hapus warna terlebih dahulu sebelum mengubah layout.

## Known Gaps

- Belum ada varian khusus untuk mode cetak/export PDF laporan KPI.
- Direktori dosen publik dan filter fakultas masih memerlukan detail responsive yang lebih spesifik bila fitur berkembang.
- Token chart saat ini mencakup Scopus dan Google Scholar. Bila sumber ketiga ditambahkan, buat token `chart-*` baru beserta varian dark yang lebih lembut.
- Komponen tertentu mungkin membutuhkan dark semantic surface tambahan jika kebutuhan status bertambah.

```

```
