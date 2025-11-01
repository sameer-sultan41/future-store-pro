"use client";

import {
    ComposedChart,
    Line,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Bar
} from "recharts";

interface DataPoint {
    label: string;
    value: number;
}

interface EarningStatisticsProps {
    data: DataPoint[];
}

const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-cyan-500 text-white px-4 py-3 rounded-xl shadow-xl border-2 border-white">
                <p className="text-xs opacity-90 font-medium">Earn</p>
                <p className="text-lg font-bold">${payload[0].value.toLocaleString()}</p>
            </div>
        );
    }
    return null;
};

const EarningStatistics = ({ data }: EarningStatisticsProps) => {
    const totalEarnings = data.reduce((sum, d) => sum + d.value, 0);
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                        Earning Statistics
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Monthly revenue overview
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Total Earnings</p>
                    <p className="text-xl font-bold bg-primary bg-clip-text text-transparent">
                        ${totalEarnings.toLocaleString()}
                    </p>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
                <ComposedChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                    <defs>
                        <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#06b6d4" />
                            <stop offset="50%" stopColor="#06b6d4" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>

                    <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#06b6d4"
                        opacity={0.3}
                        vertical={false}
                    />

                    <XAxis
                        dataKey="label"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                        dy={10}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#94a3b8', fontSize: 12 }}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    />

                    <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ stroke: '#06b6d4', strokeWidth: 2, strokeDasharray: '5 5' }}
                    />

                    {/* Background bars for depth */}
                    <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={40}
                        opacity={0.4}
                    />

                    {/* Area fill */}
                    <Area
                        type="monotone"
                        dataKey="value"
                        fill="url(#colorGradient)"
                        stroke="none"
                    />

                    {/* Main line */}
                    <Line
                        type="monotone"
                        dataKey="value"
                        stroke="url(#lineGradient)"
                        strokeWidth={3}
                        dot={{
                            r: 5,
                            fill: '#fff',
                            stroke: '#10b981',
                            strokeWidth: 3
                        }}
                        activeDot={{
                            r: 7,
                            fill: '#10b981',
                            stroke: '#fff',
                            strokeWidth: 3,
                            filter: 'drop-shadow(0 4px 6px rgba(16, 185, 129, 0.4))'
                        }}
                    />
                </ComposedChart>
            </ResponsiveContainer>

            {/* Stats footer */}
            <div className="mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Average</p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                        ${Math.round(totalEarnings / data.length).toLocaleString()}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Highest</p>
                    <p className="text-base font-bold text-emerald-600">
                        ${maxValue.toLocaleString()}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-slate-500 dark:text-slate-400">Growth</p>
                    <p className="text-base font-bold text-cyan-600">
                        +{Math.round(((data[data.length - 1]?.value || 0) / (data[0]?.value || 1) - 1) * 100)}%
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EarningStatistics;
