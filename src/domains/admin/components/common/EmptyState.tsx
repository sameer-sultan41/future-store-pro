"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, action }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            {Icon && (
                <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Icon className="w-10 h-10 text-slate-400 dark:text-slate-600" />
                </div>
            )}
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">
                {title}
            </h3>
            {description && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 text-center max-w-md">
                    {description}
                </p>
            )}
            {action && <div>{action}</div>}
        </div>
    );
};

export default EmptyState;

