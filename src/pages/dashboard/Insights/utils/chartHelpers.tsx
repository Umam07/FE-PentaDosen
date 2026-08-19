import React from 'react';
import { Sector } from 'recharts';

export const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const {
    cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 8) * cos;
  const sy = cy + (outerRadius + 8) * sin;
  const mx = cx + (outerRadius + 24) * cos;
  const my = cy + (outerRadius + 24) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 20;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g>
      {/* Center Display Info */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#8a8478" className="text-[11px] font-bold tracking-wider uppercase">
        {payload.name}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#191918" className="text-3xl dark:fill-[#ede8e1] font-mono font-black tracking-tight">
        {`${(percent * 100).toFixed(1)}%`}
      </text>

      {/* Main Active Sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />

      {/* Outer Accent Ring */}
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 10}
        outerRadius={outerRadius + 14}
        fill={fill}
        opacity={0.35}
      />

      {/* Pointer Line & Value Callout */}
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} strokeWidth={1.5} fill="none" strokeDasharray="3 3" />
      <circle cx={ex} cy={ey} r={3.5} fill={fill} stroke="#ffffff" strokeWidth={1.5} />
      <text 
        x={ex + (cos >= 0 ? 1 : -1) * 10} 
        y={ey + 4} 
        textAnchor={textAnchor} 
        fill="#2c2b29" 
        className="text-xs font-mono font-bold dark:fill-[#ede8e1]"
      >
        {`${value.toLocaleString()} Poin`}
      </text>
    </g>
  );
};
