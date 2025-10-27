"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color: "blue" | "green" | "purple" | "orange" | "red" | "pink";
}

const colorClasses = {
    blue: {
        bg: "bg-blue-500",
        lightBg: "bg-blue-50 dark:bg-blue-900/20",
        text: "text-blue-200 dark:text-blue-400",
        gradient: "from-blue-500 to-blue-600",
    },
    green: {
        bg: "bg-green-500",
        lightBg: "bg-green-100 dark:bg-green-900/20",
        text: "text-green-800 dark:text-green-400",
        gradient: "from-green-500 to-green-600",
    },
    purple: {
        bg: "bg-purple-500",
        lightBg: "bg-purple-100 dark:bg-purple-900/20",
        text: "text-purple-800 dark:text-purple-400",
        gradient: "from-purple-500 to-purple-600",
    },
    orange: {
        bg: "bg-orange-500",
        lightBg: "bg-orange-50 dark:bg-orange-900/20",
        text: "text-orange-800 dark:text-orange-400",
        gradient: "from-orange-500 to-orange-600",
    },
    red: {
        bg: "bg-red-500",
        lightBg: "bg-red-100 dark:bg-red-900/20",
        text: "text-red-700 dark:text-red-400",
        gradient: "from-red-500 to-red-600",
    },
    pink: {
        bg: "bg-pink-500",
        lightBg: "bg-pink-50 dark:bg-pink-900/20",
        text: "text-pink-800 dark:text-pink-400",
        gradient: "from-pink-500 to-pink-600",
    },
};

const StatCard = ({ title, value, icon: Icon, trend, color }: StatCardProps) => {
    const colors = colorClasses[color];

    return (
        <div className={cn(
            "group relative rounded-xl p-6 hover:shadow-lg transition-all duration-300 overflow-hidden",
            colors.lightBg
        )}>

            <div className="relative">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                            {title}
                        </p>
                        <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
                            {value}
                        </h3>
                    </div>
                    <div className={cn(
                        "p-3 rounded-lg transition-transform duration-300 group-hover:scale-110"
                    )}>
                        <Icon className={cn("w-6 h-6", colors.text)} />
                    </div>
                </div>

                {/* Trend */}
                {/* {trend && (
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "text-sm font-medium",
                            trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                        )}>
                            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            vs last month
                        </span>
                    </div>
                )} */}
            </div>
        </div>
    );
};

export default StatCard;

