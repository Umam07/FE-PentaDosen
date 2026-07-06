import { ChartDataResult, ChartDataItem } from '../types';

// Menghitung batas maksimum sumbu grafik agar proporsional
export const getNiceMax = (max: number): number => {
  if (!max || max <= 0) return 10;
  const roughMax = max * 1.15; 
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughMax)));
  return Math.ceil(roughMax / magnitude) * magnitude;
};

// Mengelompokkan dan menjumlahkan publikasi serta sitasi per tahun untuk grafik
export const aggregateChartData = (publications: any[]): ChartDataResult => {
  if (!publications || publications.length === 0) {
    return { chartData: [], leftMax: 10, rightMax: 10 };
  }
  const chartDataMap = new Map<string, ChartDataItem>();
  publications.forEach((pub: any) => {
     if (pub.year && pub.year !== 'Unknown') {
       const yearKey = String(pub.year).trim();
       if (!chartDataMap.has(yearKey)) {
          chartDataMap.set(yearKey, { name: yearKey, publications: 0, citations: 0 });
       }
       const current = chartDataMap.get(yearKey)!;
       current.publications += 1;
       current.citations += (Number(pub.citations) || 0);
     }
  });
  const chartData = Array.from(chartDataMap.values()).sort((a, b) => parseInt(a.name) - parseInt(b.name));
  return { 
    chartData, 
    leftMax: getNiceMax(Math.max(...chartData.map(d => d.publications), 0)), 
    rightMax: getNiceMax(Math.max(...chartData.map(d => d.citations), 0)) 
  };
};
