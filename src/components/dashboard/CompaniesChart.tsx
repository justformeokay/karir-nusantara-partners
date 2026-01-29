import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyData } from '@/types';

interface CompaniesChartProps {
  data: MonthlyData[];
}

export const CompaniesChart: React.FC<CompaniesChartProps> = ({ data }) => {
  return (
    <div className="stat-card h-[350px] animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Companies Registered</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="hsl(215, 15%, 50%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(215, 15%, 50%)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-sm text-accent">
                      {payload[0].value} companies
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="companies"
            fill="hsl(12, 76%, 61%)"
            radius={[6, 6, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
