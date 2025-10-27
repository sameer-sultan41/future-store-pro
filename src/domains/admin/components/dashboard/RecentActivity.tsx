"use client";

import { Package, Users, ShoppingCart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Activity {
    id: number;
    type: "product" | "user" | "order" | "traffic";
    message: string;
    time: string;
}

const activityIcons = {
    product: { icon: Package, color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20" },
    user: { icon: Users, color: "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20" },
    order: { icon: ShoppingCart, color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20" },
    traffic: { icon: TrendingUp, color: "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20" },
};

const RecentActivity = () => {
    const activities: Activity[] = [
        { id: 1, type: "product", message: "New product 'iPhone 15 Pro' added", time: "5 min ago" },
        { id: 2, type: "order", message: "Order #1234 completed", time: "15 min ago" },
        { id: 3, type: "user", message: "New user registered", time: "1 hour ago" },
        { id: 4, type: "traffic", message: "Traffic increased by 25%", time: "2 hours ago" },
        { id: 5, type: "product", message: "Product 'MacBook Pro' updated", time: "3 hours ago" },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
                Recent Activity
            </h3>
            <div className="space-y-4">
                {activities.map((activity) => {
                    const { icon: Icon, color } = activityIcons[activity.type];
                    return (
                        <div key={activity.id} className="flex items-start gap-3">
                            <div className={cn("p-2 rounded-lg", color)}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-800 dark:text-white">
                                    {activity.message}
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
            <button className="w-full mt-4 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors font-medium">
                View all activities
            </button>
        </div>
    );
};

export default RecentActivity;

