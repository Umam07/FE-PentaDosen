import Navbar from '../../../../components/Home/Navbar';
import Footer from '../../../../components/Home/Footer';

export default function ProfileInsightsSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 font-mono">
      <Navbar />
      <phantom-ui loading={true} animation="shimmer" className="block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 space-y-6">
        {/* Back button skeleton */}
        <div className="h-5 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg mb-10"></div>

        {/* Profile Card Shell */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/60 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm">
          {/* Cover Banner */}
          <div className="h-28 sm:h-32 w-full bg-slate-100 dark:bg-slate-950 border-b border-slate-200/40 dark:border-slate-800"></div>
          
          <div className="px-6 pb-6 pt-0 sm:px-8 sm:pb-8">
            {/* Profile details row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-8 relative z-10 mb-6">
              <div className="h-24 w-24 rounded-3xl bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900"></div>
              <div className="space-y-2 pb-1 flex-1 text-center sm:text-left">
                <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto sm:mx-0"></div>
                <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg mx-auto sm:mx-0"></div>
                <div className="h-3.5 w-64 bg-slate-200 dark:bg-slate-800 rounded-md mx-auto sm:mx-0"></div>
              </div>
            </div>

            <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6" />

            {/* Stats Row */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex min-h-[92px] items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-950/50">
                  <div className="h-11 w-11 rounded-xl bg-slate-200 dark:bg-slate-800 shrink-0"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                    <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Switcher Tab & Content Area */}
        <div className="h-14 w-96 bg-slate-200 dark:bg-slate-800 rounded-3xl mt-8"></div>
        <div className="h-96 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800 mt-6"></div>
      </phantom-ui>
      <Footer />
    </div>
  );
}
