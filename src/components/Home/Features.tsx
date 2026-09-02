import { motion } from 'motion/react';
import {
  Check,
  X,
  Zap,
  Calculator,
  ShieldCheck,
} from 'lucide-react';
import type { ReactNode } from 'react';

/* ------------------------------------------------------------------ */
/* Comparison row — dipakai di panel "Cara Lama" & "Dengan PentaDosen" */
/* ------------------------------------------------------------------ */

interface CompareRowProps {
  text: string;
  variant: 'old' | 'new';
}

function CompareRow({ text, variant }: CompareRowProps) {
  const isNew = variant === 'new';
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          isNew
            ? 'bg-success-soft text-success dark:bg-success/15 dark:text-success-on-dark'
            : 'bg-hairline-light-soft text-muted-soft dark:bg-hairline-dark-soft dark:text-on-dark-muted'
        }`}
        aria-hidden="true"
      >
        {isNew ? <Check className="h-3 w-3" strokeWidth={3} /> : <X className="h-3 w-3" strokeWidth={3} />}
      </span>
      <span
        className={`text-sm md:text-[15px] leading-relaxed ${
          isNew
            ? 'text-body-strong dark:text-on-dark font-medium'
            : 'text-muted dark:text-on-dark-muted'
        }`}
      >
        {text}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Pillar card — 3 pembeda utama, ringkas: 1 ikon, 1 judul, 1 kalimat  */
/* ------------------------------------------------------------------ */

interface PillarProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function Pillar({ icon, title, description, delay = 0 }: PillarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-4"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-ink-soft text-body dark:bg-surface-dark-elevated dark:text-on-dark-soft">
        {icon}
      </div>
      <div>
        <h3 className="text-[17px] font-semibold tracking-tight text-ink-heading dark:text-on-dark mb-1.5">
          {title}
        </h3>
        <p className="text-sm text-body dark:text-on-dark-soft leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function Features() {
  return (
    <section
      id="features"
      className="py-20 md:py-32 bg-canvas-light dark:bg-canvas-dark relative overflow-hidden font-sans"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-14 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-ink-heading dark:text-on-dark leading-[1.15] mb-4"
          >
            Sistem yang kerja duluan,{' '}
            <br className="hidden sm:inline" />
            bukan nunggu diinput manual.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08 }}
            className="text-base sm:text-lg text-body dark:text-on-dark-soft leading-relaxed"
          >
            Kebanyakan sistem kampus sekadar menjadi tempat penyimpanan data. PentaDosen dirancang aktif — menarik data publikasi, menghitung poin kinerja, hingga menyiapkan dokumen untuk audit secara otomatis.
          </motion.p>
        </div>

        {/* Before / After Comparison Panel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-6 md:mb-8">

          {/* CARA LAMA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-dashed border-hairline-light bg-surface-light p-8 md:p-10 dark:border-hairline-dark dark:bg-surface-dark"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[1.2px] text-muted-soft dark:text-on-dark-muted mb-4 block">
              Cara Lama
            </span>
            <h3 className="text-xl font-semibold text-body-strong dark:text-on-dark-soft tracking-tight mb-6">
              Sistem akademik pada umumnya
            </h3>
            <ul className="space-y-4">
              <CompareRow variant="old" text="Data publikasi diinput manual satu per satu" />
              <CompareRow variant="old" text="Poin kinerja dihitung sendiri pakai rumus Excel" />
              <CompareRow variant="old" text="Bukti fisik baru dicari saat mendekati jadwal audit" />
              <CompareRow variant="old" text="Data sitasi sering tertinggal dan tidak ter-update" />
            </ul>
          </motion.div>

          {/* DENGAN PENTADOSEN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-hairline-light bg-surface-light p-8 md:p-10 shadow-sm transition-all duration-300 hover:border-ink-border dark:border-hairline-dark dark:bg-surface-dark dark:hover:border-hairline-dark"
          >
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[1.2px] text-accent dark:text-accent-on-dark mb-4 block">
              Dengan PentaDosen
            </span>
            <h3 className="text-xl font-semibold text-ink-heading dark:text-on-dark tracking-tight mb-6">
              Otomatis dari awal sampai akhir
            </h3>
            <ul className="space-y-4">
              <CompareRow variant="new" text="Sinkron otomatis dari Google Scholar & Scopus" />
              <CompareRow variant="new" text="Poin Tri Dharma terhitung otomatis sesuai regulasi" />
              <CompareRow variant="new" text="Dokumen tersusun rapi, siap diverifikasi kapan saja" />
              <CompareRow variant="new" text="Data selalu mutakhir tanpa perlu pengecekan manual" />
            </ul>
          </motion.div>
        </div>

        {/* 3 Pilar Pembeda — ringkas, bukan feature dump */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 pt-10 md:pt-12 border-t border-hairline-light-soft dark:border-hairline-dark-soft">
          <Pillar
            delay={0}
            icon={<Zap className="h-5 w-5" />}
            title="Sinkron Otomatis, Tanpa Repot"
            description="Karya ilmiah, sitasi, dan H-Index terhimpun otomatis dari Google Scholar dan Scopus. Dosen tetap dapat memperbarui data secara mandiri kapan saja."
          />
          <Pillar
            delay={0.08}
            icon={<Calculator className="h-5 w-5" />}
            title="Poin Kinerja Terhitung Otomatis"
            description="Tanpa rumus manual. Akumulasi angka kredit Tri Dharma dihitung otomatis sesuai bobot dan regulasi akademik yang berlaku."
          />
          <Pillar
            delay={0.16}
            icon={<ShieldCheck className="h-5 w-5" />}
            title="Dokumen Siap Audit Kapan Saja"
            description="Seluruh berkas melewati verifikasi berjenjang Fakultas dan LPPM, siap diekspor ke format PDF maupun Excel saat dibutuhkan."
          />
        </div>

      </div>
    </section>
  );
}