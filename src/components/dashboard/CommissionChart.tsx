import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyData } from '@/types';
import { formatCurrency } from '@/lib/mock-data';

interface CommissionChartProps {
  data: MonthlyData[];
}

export const CommissionChart: React.FC<CommissionChartProps> = ({ data }) => {
  return (
    <div className="stat-card h-[350px] animate-fade-in">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Commission Growth</h3>
      <ResponsiveContainer width="100%" height="85%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(168, 76%, 42%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(214, 20%, 90%)" />
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
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border border-border bg-card p-3 shadow-lg">
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-sm text-primary">
                      {formatCurrency(payload[0].value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="commission"
            stroke="hsl(168, 76%, 42%)"
            strokeWidth={2}
            fill="url(#commissionGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
