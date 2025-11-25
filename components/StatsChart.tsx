import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { StatPoint } from '../types';

interface StatsChartProps {
  data: StatPoint[];
  color: string;
}

const StatsChart: React.FC<StatsChartProps> = ({ data, color }) => {
  // Tailwind colors map to hex for Recharts
  const getColorHex = (twClass: string) => {
    if (twClass.includes('emerald')) return '#10b981';
    if (twClass.includes('purple')) return '#9333ea';
    if (twClass.includes('blue')) return '#2563eb';
    if (twClass.includes('orange')) return '#f97316';
    if (twClass.includes('yellow')) return '#eab308';
    if (twClass.includes('amber')) return '#b45309';
    return '#cbd5e1';
  };

  const fill = getColorHex(color);

  return (
    <div className="h-64 w-full bg-slate-900/50 rounded-lg p-4 border border-slate-700/50">
      <h4 className="text-sm font-semibold text-slate-400 mb-4">Frequência nos últimos jogos</h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="number" 
            tick={{ fill: '#94a3b8', fontSize: 12 }} 
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
          />
          <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={fill} fillOpacity={0.8 + (index * 0.02)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StatsChart;
