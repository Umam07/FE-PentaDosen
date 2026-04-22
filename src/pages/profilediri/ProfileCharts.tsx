import { useState } from 'react';
import { 
  ResponsiveContainer, ComposedChart, Bar, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  Legend, Customized 
} from 'recharts';

// 1. Komponen Kustom Crosshair ala TradingView
export const CustomCrosshair = (props: any) => {
  const { offset, leftMax, rightMax, crosshairData, color = "#3b82f6" } = props;
  
  if (!offset || !crosshairData || crosshairData.y === undefined || crosshairData.x === undefined) return null;

  const { left, right, top, bottom, height } = offset;
  const { x, y, year } = crosshairData;

  const boundedY = Math.max(top, Math.min(bottom, y));

  const ratio = (bottom - boundedY) / height;
  const leftValue = (ratio * leftMax).toFixed(1);
  const rightValue = (ratio * rightMax).toFixed(1);

  const lineColor = "#94a3b8"; // slate-400
  const badgeBg = "#0f172a"; // slate-900
  const textColor = "#ffffff"; 

  return (
    <g className="recharts-custom-crosshair pointer-events-none">
      <line x1={left} y1={boundedY} x2={right} y2={boundedY} stroke={lineColor} strokeDasharray="4 4" strokeWidth={1} opacity={0.5} />
      <line x1={x} y1={top} x2={x} y2={bottom} stroke={lineColor} strokeDasharray="4 4" strokeWidth={1} opacity={0.5} />

      <circle cx={x} cy={boundedY} r={5} fill={color} />
      <circle cx={x} cy={boundedY} r={12} fill={color} opacity={0.15} />

      {/* Left Badge */}
      <rect x={left - 45} y={boundedY - 10} width={40} height={20} rx={6} fill={badgeBg} />
      <text x={left - 25} y={boundedY + 4} fill={textColor} fontSize={10} textAnchor="middle" fontWeight="800">{leftValue}</text>

      {/* Right Badge */}
      <rect x={right + 5} y={boundedY - 10} width={40} height={20} rx={6} fill={badgeBg} />
      <text x={right + 25} y={boundedY + 4} fill={textColor} fontSize={10} textAnchor="middle" fontWeight="800">{rightValue}</text>

      {/* Bottom Badge */}
      <rect x={x - 25} y={bottom + 8} width={50} height={22} rx={6} fill={badgeBg} />
      <text x={x} y={bottom + 23} fill={textColor} fontSize={10} textAnchor="middle" fontWeight="800">{year}</text>
    </g>
  );
};

// 2. Komponen Tooltip
export const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-2xl min-w-[180px] ring-1 ring-black/5">
        <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest mb-3 border-b border-slate-100 dark:border-slate-800 pb-3">Tahun {label}</p>
        <div className="space-y-3">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div 
                  className="w-2.5 h-2.5 rounded-full ring-4 ring-current/10" 
                  style={{ color: entry.color, backgroundColor: entry.color }}
                />
                <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{entry.name}</span>
              </div>
              <span className="text-sm font-black text-slate-900 dark:text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// 3. Chart Trend
export const ProfileTrendChart = ({ 
  chartData, 
  leftDomainMax, 
  rightDomainMax,
  barColor = "#3b82f6",
  barGradientColor = "#60a5fa",
  lineColor = "#a855f7",
  areaGradientColor = "#a855f7",
  gradientId = "default"
}: any) => {
  const [crosshair, setCrosshair] = useState<{ x: number, y: number, year: string } | null>(null);

  return (
    <div className="w-full h-full relative group/chart"> 
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart 
          data={chartData} 
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }} 
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
          <defs>
            <linearGradient id={`barGradient-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={barColor} stopOpacity={1} />
              <stop offset="100%" stopColor={barGradientColor} stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id={`areaGradient-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={areaGradientColor} stopOpacity={0.2} />
              <stop offset="100%" stopColor={areaGradientColor} stopOpacity={0} />
            </linearGradient>
            <filter id={`barShadow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
              <feOffset dx="0" dy="4" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.1" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid 
            strokeDasharray="0" 
            vertical={false} 
            stroke="#cbd5e1" 
            opacity={0.1} 
          />
          
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} 
            tickLine={false} 
            axisLine={false} 
            dy={15}
          />
          
          <YAxis 
            yAxisId="left" 
            orientation="left" 
            domain={[0, leftDomainMax]} 
            tick={{ fill: barColor, fontSize: 10, fontWeight: 800 }} 
            tickLine={false} 
            axisLine={false} 
            dx={-10}
            label={{ 
              value: 'PUBLIKASI', 
              position: 'top', 
              offset: 25,
              style: { textAnchor: 'start', fill: barColor, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' },
            }}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            domain={[0, rightDomainMax]} 
            tick={{ fill: lineColor, fontSize: 10, fontWeight: 800 }} 
            tickLine={false} 
            axisLine={false} 
            dx={10} 
            label={{ 
              value: 'SITASI', 
              position: 'top', 
              offset: 25,
              style: { textAnchor: 'end', fill: lineColor, fontSize: 10, fontWeight: 900, letterSpacing: '0.1em' },
            }}
          />
          
          <RechartsTooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '4 4', opacity: 0.2 }} 
            animationDuration={300}
          />
          
          <Legend 
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ 
              paddingTop: '30px', 
              fontSize: '10px', 
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }} 
          />
          
          <Bar 
            yAxisId="left" 
            dataKey="publications" 
            name="Publikasi" 
            fill={`url(#barGradient-${gradientId})`} 
            radius={[10, 10, 0, 0]} 
            maxBarSize={32}
            filter={`url(#barShadow-${gradientId})`}
            animationBegin={0}
            animationDuration={1500}
            animationEasing="ease-out"
          />

          <Area
            yAxisId="right"
            type="monotone"
            dataKey="citations"
            stroke="none"
            fill={`url(#areaGradient-${gradientId})`}
            legendType="none"
            animationBegin={500}
            animationDuration={2000}
          />

          <Line 
            yAxisId="right" 
            type="monotone" 
            dataKey="citations" 
            name="Sitasi" 
            stroke={lineColor} 
            strokeWidth={4} 
            dot={{ r: 0 }} 
            activeDot={{ 
              r: 6, 
              fill: lineColor, 
              stroke: '#fff', 
              strokeWidth: 3,
            }} 
            animationBegin={500}
            animationDuration={2000}
          />

          <Customized 
            component={(props: any) => (
              <CustomCrosshair 
                {...props} 
                crosshairData={crosshair} 
                leftMax={leftDomainMax} 
                rightMax={rightDomainMax} 
                color={barColor}
              />
            )} 
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};


