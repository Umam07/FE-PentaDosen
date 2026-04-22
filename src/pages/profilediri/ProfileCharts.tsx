import { useState } from 'react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, Customized 
} from 'recharts';

// 1. Komponen Kustom Crosshair ala TradingView
export const CustomCrosshair = (props: any) => {
  const { offset, leftMax, rightMax, crosshairData } = props;
  
  if (!offset || !crosshairData || crosshairData.y === undefined || crosshairData.x === undefined) return null;

  const { left, right, top, bottom, height } = offset;
  const { x, y, year } = crosshairData;

  const boundedY = Math.max(top, Math.min(bottom, y));

  const ratio = (bottom - boundedY) / height;
  const leftValue = (ratio * leftMax).toFixed(1);
  const rightValue = (ratio * rightMax).toFixed(1);

  const lineColor = "#71717a"; 
  const badgeBg = "#18181b"; 
  const textColor = "#ffffff"; 

  return (
    <g className="recharts-custom-crosshair pointer-events-none">
      <line x1={left} y1={boundedY} x2={right} y2={boundedY} stroke={lineColor} strokeDasharray="3 3" strokeWidth={1} />
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={lineColor} strokeDasharray="3 3" strokeWidth={1} />

      <circle cx={x} cy={boundedY} r={4.5} fill="#0ea5e9" />
      <circle cx={x} cy={boundedY} r={10} fill="#0ea5e9" opacity={0.25} />

      <path d={`M ${left} ${boundedY} L ${left - 6} ${boundedY - 11} H ${left - 42} V ${boundedY + 11} H ${left - 6} Z`} fill={badgeBg} />
      <text x={left - 23} y={boundedY + 3.5} fill={textColor} fontSize={11} textAnchor="middle" fontWeight="500">{leftValue}</text>

      <path d={`M ${right} ${boundedY} L ${right + 6} ${boundedY - 11} H ${right + 42} V ${boundedY + 11} H ${right + 6} Z`} fill={badgeBg} />
      <text x={right + 24} y={boundedY + 3.5} fill={textColor} fontSize={11} textAnchor="middle" fontWeight="500">{rightValue}</text>

      <path d={`M ${x} ${bottom} L ${x + 6} ${bottom + 6} H ${x + 22} V ${bottom + 24} H ${x - 22} V ${bottom + 6} L ${x - 6} ${bottom + 6} Z`} fill={badgeBg} />
      <text x={x} y={bottom + 17} fill={textColor} fontSize={11} textAnchor="middle" fontWeight="500">{year}</text>
    </g>
  );
};

// 2. Komponen Tooltip
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 p-4 rounded-xl shadow-xl shrink-0 min-w-[150px] font-sans">
        <p className="text-gray-900 dark:text-gray-100 font-bold mb-2 border-b border-gray-100 dark:border-zinc-700 pb-2">Tahun {label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4 text-sm mb-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-gray-600 dark:text-zinc-400">{entry.name}:</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// 3. Chart Trend
export const ProfileTrendChart = ({ chartData, leftDomainMax, rightDomainMax }: any) => {
  const [crosshair, setCrosshair] = useState<{ x: number, y: number, year: string } | null>(null);

  return (
    <div className="w-full overflow-x-auto pb-4"> 
      <div className="h-80 min-w-[500px] w-full relative"> 
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 40, right: 60, bottom: 35, left: 60 }} 
            onMouseMove={(state: any) => {
              if (state && state.isTooltipActive && state.activeCoordinate) {
                setCrosshair({ 
                  x: state.activeCoordinate.x,
                  y: state.chartY,
                  year: state.activeLabel 
                });
              } else {
                setCrosshair(null);
              }
            }}
            onMouseLeave={() => setCrosshair(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#3f3f46" opacity={0.15} />
            
            <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} dy={10} />
            
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              domain={[0, leftDomainMax]} 
              tick={{ fill: '#0d9488', fontSize: 12, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false} 
              dx={-10} 
              label={{ 
                value: 'Publikasi', 
                position: 'top', 
                offset: 20, 
                fill: '#0d9488', 
                fontWeight: 'bold',
                style: { textAnchor: 'start', fontStyle: 'normal' }
              }} 
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, rightDomainMax]} 
              tick={{ fill: '#a855f7', fontSize: 12, fontWeight: 500 }} 
              tickLine={false} 
              axisLine={false} 
              dx={10} 
              label={{ 
                value: 'Sitasi', 
                position: 'top', 
                offset: 20, 
                fill: '#a855f7', 
                fontWeight: 'bold',
                style: { textAnchor: 'end', fontStyle: 'normal' }
              }} 
            />
            
            <RechartsTooltip content={<CustomTooltip />} cursor={false} />
            <Legend wrapperStyle={{ paddingTop: '25px', fontSize: '12px', fontWeight: 500 }} />
            
            <Customized 
              component={(props: any) => (
                <CustomCrosshair 
                  {...props} 
                  crosshairData={crosshair} 
                  leftMax={leftDomainMax} 
                  rightMax={rightDomainMax} 
                />
              )} 
            />

            <Bar yAxisId="left" dataKey="publications" name="Jumlah Publikasi" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={45} />
            <Line yAxisId="right" type="monotone" dataKey="citations" name="Sitasi" stroke="#a855f7" strokeWidth={3} dot={{ r: 4, fill: '#a855f7', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, strokeWidth: 0, fill: '#a855f7' }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
