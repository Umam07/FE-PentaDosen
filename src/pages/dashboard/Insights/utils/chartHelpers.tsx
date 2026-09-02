import React from 'react';
import { Sector } from 'recharts';

export const renderPieShape = (props: any, activeIndex: number) => {
  const isCurrentActive = props.index === activeIndex;

  if (!isCurrentActive) {
    return (
      <Sector
        cx={props.cx}
        cy={props.cy}
        innerRadius={props.innerRadius}
        outerRadius={props.outerRadius}
        startAngle={props.startAngle}
        endAngle={props.endAngle}
        fill={props.fill}
        cornerRadius={6}
      />
    );
  }

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

  const percentageStr = percent !== undefined && !isNaN(percent)
    ? `${(percent * 100).toFixed(1)}%`
    : '0.0%';
  const valueStr = value !== undefined && !isNaN(value)
    ? `${(value || 0).toLocaleString()} Poin`
    : '0 Poin';
  const nameStr = payload?.name || '';

  return (
    <g>
      {/* Center Display Info */}
      <text x={cx} y={cy - 12} textAnchor="middle" fill="#8a8478" className="text-[11px] font-bold tracking-wider uppercase">
        {nameStr}
      </text>
      <text x={cx} y={cy + 18} textAnchor="middle" fill="#191918" className="text-3xl dark:fill-[#ede8e1] font-mono font-black tracking-tight">
        {percentageStr}
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
        cornerRadius={6}
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
        cornerRadius={3}
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
        {valueStr}
      </text>
    </g>
  );
};

export const renderActiveShape = (props: any) => {
  return renderPieShape(props, props.index);
};

