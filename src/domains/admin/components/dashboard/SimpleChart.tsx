"use client";

import { cn } from "@/lib/utils";

interface ChartData {
    label: string;
    value: number;
}

interface SimpleChartProps {
    title: string;
    data: ChartData[];
    color?: string;
}

const SimpleChart = ({ title, data, color = "bg-blue-500" }: SimpleChartProps) => {
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
                {title}
            </h3>
            <div className="space-y-4">
                {data.map((item, index) => (
                    <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-600 dark:text-slate-400">
                                {item.label}
                            </span>
                            <span className="font-semibold text-slate-800 dark:text-white">
                                {item.value}
                            </span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                                className={cn(
                                    "h-full rounded-full transition-all duration-500 ease-out",
                                    color
                                )}
                                style={{
                                    width: `${(item.value / maxValue) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SimpleChart;

