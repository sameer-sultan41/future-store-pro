"use client";

import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
    title: string;
    description?: string;
    icon?: LucideIcon;
    actions?: React.ReactNode;
}

const PageHeader = ({ title, description, icon: Icon, actions }: PageHeaderProps) => {
    return (
        <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
                {Icon && (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white">
                        {title}
                    </h1>
                    {description && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                            {description}
                        </p>
                    )}
                </div>
            </div>
            {actions && <div>{actions}</div>}
        </div>
    );
};

export default PageHeader;
