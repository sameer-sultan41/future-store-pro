"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Package,
    FolderTree,
    Tags,
    BarChart3,
    Menu,
    X
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        label: "Products",
        href: "/admin/products",
        icon: <Package className="w-5 h-5" />,
    },
    {
        label: "Categories",
        href: "/admin/categories",
        icon: <FolderTree className="w-5 h-5" />,
    },
    {
        label: "Brands",
        href: "/admin/brands",
        icon: <Tags className="w-5 h-5" />,
    },
    {
        label: "Traffic View",
        href: "/admin/trafficView/1",
        icon: <BarChart3 className="w-5 h-5" />,
    },
];

const AdminSidebar = () => {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const isActive = (href: string) => {
        if (href === "/admin") {
            return pathname === "/admin" || pathname.endsWith("/admin");
        }
        return pathname.includes(href);
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className={`lg:hidden ${isCollapsed ? "hidden" : "fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"}`}
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar */}
            <aside
                className={cn(
                    "h-full bg-white shadow-md border-r border-gray-200 shadow-gray-300 transition-all duration-300 flex flex-col",
                    isCollapsed ? "w-20" : "w-72",
                    "max-lg:hidden"
                )}
            >
                {/* Logo Section */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                            <LayoutDashboard className="w-6 h-6 text-white" />
                        </div>
                        {!isCollapsed && (
                            <div>
                                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Future Store</h1>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Admin Dashboard</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-2 overflow-y-auto">
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200 group relative",
                                    isActive(item.href)
                                        ? "bg-primary text-white shadow-md shadow-blue-500/50"
                                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white",
                                    isCollapsed && "justify-center"
                                )}
                            >
                                <div className={cn(
                                    "transition-transform duration-200",
                                    isActive(item.href) ? "scale-110" : "group-hover:scale-110"
                                )}>
                                    {item.icon}
                                </div>
                                {!isCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                                {/* {isActive(item.href) && !isCollapsed && (
                                    <div className="absolute right-4 w-2 h-2 bg-white rounded-full animate-pulse" />
                                )} */}

                                {/* Tooltip for collapsed state */}
                                {isCollapsed && (
                                    <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-xl border border-slate-200 z-50">
                                        {item.label}
                                    </div>
                                )}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-slate-300 dark:border-slate-700">
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200  cursor-pointer",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <Menu className="w-5 h-5" />
                        {!isCollapsed && <span className="font-medium">Collapse</span>}
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar */}
            <aside
                className={cn(
                    "lg:hidden fixed inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-40 transition-transform duration-300 flex flex-col",
                    isCollapsed ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo Section */}
                <div className="p-6 border-b border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                                <LayoutDashboard className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Future Store</h1>
                                <p className="text-xs text-slate-400">Admin Dashboard</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsCollapsed(false)}
                            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsCollapsed(false)}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                                    isActive(item.href)
                                        ? "bg-primary text-white shadow-lg"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                )}
                            >
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>
                </nav>
            </aside>

            {/* Mobile Overlay */}
            {isCollapsed && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsCollapsed(false)}
                />
            )}
        </>
    );
};

export default AdminSidebar;
