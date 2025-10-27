"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingDown, TrendingUp } from "lucide-react";

interface SalesTargetProps {
  dailyTarget: number;
  dailyAchieved: number;
  monthlyTarget: number;
  monthlyAchieved: number;
}

const SalesTarget = ({
  dailyTarget,
  dailyAchieved,
  monthlyTarget,
  monthlyAchieved,
}: SalesTargetProps) => {
  const monthlyPercentage = Math.min((monthlyAchieved / monthlyTarget) * 100, 100);

  const data = [
    { name: "Achieved", value: monthlyPercentage },
    { name: "Remaining", value: 100 - monthlyPercentage },
  ];

  const COLORS = ["url(#gradient)", "#e5e7eb"];

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">
        Sales Target
      </h3>

      {/* Circular Progress Chart */}
      <div className="relative flex justify-center items-center mb-8">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              startAngle={90}
              endAngle={-270}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={0}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Center text overlay */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">
            {monthlyPercentage.toFixed(0)}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Completed
          </div>
        </div>
      </div>

      {/* Targets info */}
      <div className="space-y-4">
        {/* Daily Target */}
        <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Daily Target
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-red-500" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {dailyAchieved.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Monthly Target */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-cyan-50 to-emerald-50 dark:from-cyan-900/20 dark:to-emerald-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Monthly Target
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {monthlyAchieved.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesTarget;
