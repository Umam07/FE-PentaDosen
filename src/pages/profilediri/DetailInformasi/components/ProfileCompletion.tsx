import React from 'react';
import { Award, BadgeCheck } from 'lucide-react';

interface CompletionItem {
  label: string;
  done: boolean;
}

interface ProfileCompletionProps {
  completionPercent: number;
  completionItems: CompletionItem[];
}

export const ProfileCompletion: React.FC<ProfileCompletionProps> = ({
  completionPercent,
  completionItems,
}) => {
  return (
    <div className="rounded-[2rem] border border-slate-200/60 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Kelengkapan Profil
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
            {completionPercent}%
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-500 dark:bg-amber-950/20">
          <Award className="h-6 w-6" />
        </div>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
        <div
          className="h-2 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-700"
          style={{ width: `${completionPercent}%` }}
        />
      </div>
      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        {completionItems.map((item) => (
          <div key={item.label} className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <BadgeCheck
              className={`h-4 w-4 ${item.done ? 'text-emerald-500' : 'text-slate-300 dark:text-slate-700'}`}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
