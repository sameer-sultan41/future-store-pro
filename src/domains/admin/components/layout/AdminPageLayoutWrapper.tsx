"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    ChevronRight,
    Home,
    LayoutDashboard,
    Package,
    FolderTree,
    Tags,
    BarChart3,
    LucideIcon
} from "lucide-react";
import { ReactNode } from "react";

interface PageConfig {
    path: string;
    title: string;
    icon: LucideIcon;
}

const pageConfigs: PageConfig[] = [
    {
        path: "/admin",
        title: "Dashboard",
        icon: LayoutDashboard,
    },
    {
        path: "/admin/products/new",
        title: "Add New Product",
        icon: Package,
    },
    {
        path: "/admin/products",
        title: "Products",
        icon: Package,
    },
    {
        path: "/admin/categories",
        title: "Categories",
        icon: FolderTree,
    },
    {
        path: "/admin/brands",
        title: "Brands",
        icon: Tags,
    },
    {
        path: "/admin/trafficView",
        title: "Traffic View",
        icon: BarChart3,
    },
];

interface AdminPageLayoutWrapperProps {
    children: ReactNode;
}

const AdminPageLayoutWrapper = ({ children }: AdminPageLayoutWrapperProps) => {
    const pathname = usePathname();

    // Find the matching page config
    const currentPage = pageConfigs.find((config) => {
        if (config.path === "/admin") {
            return pathname === "/admin" || pathname.endsWith("/admin");
        }
        return pathname.includes(config.path);
    }) || pageConfigs[0]; // Default to dashboard if no match

    const isHomePage = pathname === "/admin" || pathname.endsWith("/admin");
    const PageIcon = currentPage.icon;

    return (
        <div className="h-full flex flex-col">
            {/* Breadcrumbs and Page Title */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link
                            href="/admin"
                            className="flex items-center text-slate-500 dark:text-slate-400 hover:text-primary transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            {isHomePage && <span className="text-slate-500 ml-2">Dashboard</span>}
                        </Link>
                        {!isHomePage && (
                            <>
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                                <span className="text-slate-500 dark:text-slate-400">
                                    {currentPage.title}
                                </span>
                            </>
                        )}
                    </nav>
                </div>
            </div>

            {/* Page Content */}
            <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
    );
};

export default AdminPageLayoutWrapper;

