import { motion } from 'motion/react';
import {
  Check,
  X,
  RefreshCw,
  Calculator,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Baris Komparasi — Bersih, teks natural, tanpa visual berlebihan     */
/* ------------------------------------------------------------------ */

interface CompareItemProps {
  title: string;
  description: string;
  isPositive: boolean;
}

function CompareItem({ title, description, isPositive }: CompareItemProps) {
  return (
    <li className="flex items-start gap-4">
      <span
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          isPositive
            ? 'bg-success-soft text-success dark:bg-success/15 dark:text-success-on-dark'
            : 'bg-hairline-light text-muted dark:bg-hairline-dark dark:text-on-dark-muted'
        }`}
        aria-hidden="true"
      >
        {isPositive ? (
          <Check className="h-3 w-3" strokeWidth={3} />
        ) : (
          <X className="h-3 w-3" strokeWidth={2.5} />
        )}
      </span>
      <div className="space-y-1">
        <p
          className={`text-sm md:text-base font-semibold leading-snug ${
            isPositive
              ? 'text-ink-heading dark:text-on-dark'
              : 'text-body-strong dark:text-on-dark-soft'
          }`}
        >
          {title}
        </p>
        <p className="text-xs md:text-sm text-body dark:text-on-dark-muted leading-relaxed">
          {description}
        </p>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Pilar Fitur — Luas, tanpa kartu di dalam kartu, fokus tipografi    */
/* ------------------------------------------------------------------ */

interface FeaturePillarProps {
  icon: ReactNode;
  title: string;
  description: string;
  points: string[];
  delay?: number;
}

function FeaturePillar({ icon, title, description, points, delay = 0 }: FeaturePillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col justify-between rounded-3xl border border-hairline-light bg-surface-light p-8 md:p-10 dark:border-hairline-dark dark:bg-surface-dark transition-colors duration-200"
    >
      <div>
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-soft text-ink-heading dark:bg-surface-dark-elevated dark:text-on-dark border border-hairline-light-soft dark:border-hairline-dark mb-6">
          {icon}
        </div>

        <h3 className="text-xl font-semibold tracking-tight text-ink-heading dark:text-on-dark mb-3 leading-snug">
          {title}
        </h3>

        <p className="text-sm md:text-[15px] text-body dark:text-on-dark-soft leading-relaxed mb-6">
          {description}
        </p>
      </div>

      <ul className="space-y-2.5 pt-6 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
        {points.map((point, idx) => (
          <li key={idx} className="flex items-center gap-2.5 text-xs md:text-sm text-body dark:text-on-dark-soft font-medium">
            <span className="h-1 w-1 rounded-full bg-muted dark:bg-on-dark-muted shrink-0" aria-hidden="true" />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="py-24 md:py-32 bg-canvas-light dark:bg-canvas-dark relative font-sans transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="max-w-3xl mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-heading dark:text-on-dark leading-[1.15] mb-5"
          >
            Sistem yang bekerja otomatis,{' '}
            <br className="hidden sm:inline" />
            <span className="text-accent dark:text-accent-on-dark">bukan menunggu entri manual.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-base sm:text-lg text-body dark:text-on-dark-soft leading-relaxed"
          >
            Memangkas beban rekapitulasi berkas setiap periode pelaporan. Seluruh capaian kinerja dan portofolio dosen terhimpun rapi secara berkelanjutan, siap dievaluasi kapan pun dibutuhkan.
          </motion.p>
        </div>

        {/* Panel Komparasi Alur Kerja */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 md:mb-24">

          {/* Sisi Kiri: Sebelum Menggunakan PentaDosen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-hairline-light bg-surface-light-raised/60 p-8 sm:p-10 dark:border-hairline-dark dark:bg-surface-dark-soft/70 flex flex-col justify-between"
          >
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-muted dark:text-on-dark-muted mb-3">
                Sebelum Menggunakan PentaDosen
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold text-body-strong dark:text-on-dark-soft tracking-tight mb-8">
                Rekapitulasi data dilakukan manual
              </h3>

              <ul className="space-y-6">
                <CompareItem
                  isPositive={false}
                  title="Pencatatan artikel satu per satu"
                  description="Dosen harus menyalin judul, nomor DOI, nama jurnal, dan indeksasi secara berulang."
                />
                <CompareItem
                  isPositive={false}
                  title="Perhitungan angka kredit rawan selisih"
                  description="Rumus Excel dihitung mandiri sehingga sering terjadi perbedaan penafsiran aturan kredit."
                />
                <CompareItem
                  isPositive={false}
                  title="Dokumen baru dicari saat mendekati audit"
                  description="Bukti fisik PDF tersebar di berbagai folder dan perangkat, memicu kepanikan menjelang audit."
                />
                <CompareItem
                  isPositive={false}
                  title="Data sitasi dan reputasi riset tertinggal"
                  description="Angka sitasi serta H-Index di portal kampus tidak diperbarui secara berkala."
                />
              </ul>
            </div>
          </motion.div>

          {/* Sisi Kanan: Dengan PentaDosen */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-hairline-light bg-surface-light p-8 sm:p-10 shadow-xs dark:border-hairline-dark dark:bg-surface-dark flex flex-col justify-between"
          >
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent dark:text-accent-on-dark mb-3">
                Dengan PentaDosen
              </p>
              <h3 className="text-xl sm:text-2xl font-semibold text-ink-heading dark:text-on-dark tracking-tight mb-8">
                Tersinkronisasi dan siap verifikasi
              </h3>

              <ul className="space-y-6">
                <CompareItem
                  isPositive={true}
                  title="Tarik data otomatis dari Google Scholar &amp; Scopus"
                  description="Metadata publikasi, jumlah sitasi, dan H-Index terhimpun langsung ke sistem tanpa input manual."
                />
                <CompareItem
                  isPositive={true}
                  title="Kalkulasi poin Tri Dharma otomatis dan transparan"
                  description="Nilai kredit dihitung terstandarisasi berdasarkan skema, kategori jurnal, dan regulasi PO PAK Dikti."
                />
                <CompareItem
                  isPositive={true}
                  title="Arsip digital terpusat, siap audit kapan saja"
                  description="Dokumen bukti tersusun rapi dengan alur verifikasi bertingkat dari Fakultas hingga LPPM."
                />
                <CompareItem
                  isPositive={true}
                  title="Data sitasi dan publikasi selalu diperbarui"
                  description="Perkembangan sitasi, H-Index, dan rekam jejak riset dosen terpantau otomatis tanpa perlu dicek satu per satu."
                />
              </ul>
            </div>
          </motion.div>
        </div>

        {/* 3 Pilar Kemampuan Utama — Desain Lapang & Bersih */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeaturePillar
            delay={0}
            icon={<RefreshCw className="h-6 w-6" />}
            title="Sinkronisasi Publikasi Otomatis"
            description="Karya ilmiah, sitasi, dan indeksasi Scopus serta Google Scholar dihimpun terjadwal. Dosen tetap dapat memicu penyelarasan mandiri kapan saja."
            points={[
              'Integrasi ID Scopus & Google Scholar',
              'Penyaringan artikel ganda (deduplikasi)',
              'Pembaruan jumlah sitasi berkala'
            ]}
          />

          <FeaturePillar
            delay={0.08}
            icon={<Calculator className="h-6 w-6" />}
            title="Perhitungan Poin KPI Objektif"
            description="Poin kinerja akademik dihitung otomatis sesuai bobot kategori jurnal (SINTA, Scopus Q1–Q4, prosiding) serta peran kepenulisan dosen."
            points={[
              'Aturan baku berbasis pedoman Dikti',
              'Proporsi penulis pertama dan anggota',
              'Transparansi riwayat perhitungan poin'
            ]}
          />

          <FeaturePillar
            delay={0.16}
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Verifikasi Berjenjang &amp; Siap Audit"
            description="Mendukung alur validasi resmi oleh Fakultas dan LPPM YARSI. Data rekapitulasi portofolio siap diekspor ke Excel dan PDF saat akreditasi."
            points={[
              'Persetujuan bertingkat Fakultas & LPPM',
              'Status verifikasi dokumen transparan',
              'Ekspor laporan resmi Excel & PDF'
            ]}
          />
        </div>

      </div>
    </section>
  );
}