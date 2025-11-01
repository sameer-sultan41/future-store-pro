"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface DataPoint {
    label: string;
    value: number;
}

interface UserHitRateProps {
    data: DataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-xs opacity-90">{label}</p>
                <p className="text-base font-bold">{payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const UserHitRate = ({ data }: UserHitRateProps) => {
    const maxValue = Math.max(...data.map(d => d.value));
    const maxIndex = data.findIndex(d => d.value === maxValue);

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                    User Hit Rate
                </h3>
                <div className="flex items-center gap-2">
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                        Peak: {data[maxIndex]?.label}
                    </div>
                    <div className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 rounded-lg text-sm font-semibold">
                        {maxValue.toLocaleString()}
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="url(#strokeGradient)"
                        strokeWidth={3}
                        fill="url(#colorValue)"
                        activeDot={{ r: 6, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
                        dot={{ r: 4, fill: '#fff', stroke: '#06b6d4', strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UserHitRate;
