"use client";

import { Bell, Search, User, LogOut, Settings, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
    title: string;
}

const AdminHeader = ({ title }: AdminHeaderProps) => {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const { theme, setTheme } = useTheme();

    const notifications = [
        { id: 1, message: "New order received", time: "5 min ago", unread: true },
        { id: 2, message: "Product stock low", time: "1 hour ago", unread: true },
        { id: 3, message: "New user registered", time: "2 hours ago", unread: false },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    return (
        <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left Section - Title and Breadcrumb */}
                <div className="flex items-center gap-4">
                </div>

                {/* Right Section - Actions */}
                <div className="flex items-center gap-4">
                    {/* Search Bar */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 w-64 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 dark:text-white placeholder-slate-400"
                        />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        ) : (
                            <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                        )}
                    </button>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowNotifications(!showNotifications);
                                setShowProfileMenu(false);
                            }}
                            className="relative p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <Bell className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <h3 className="font-semibold text-slate-800 dark:text-white">
                                        Notifications
                                    </h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        You have {unreadCount} unread notifications
                                    </p>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={cn(
                                                "px-4 py-3 border-b border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors cursor-pointer",
                                                notification.unread && "bg-blue-50 dark:bg-blue-900/20"
                                            )}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full flex-shrink-0" />
                                                <div className="flex-1">
                                                    <p className="text-sm text-slate-800 dark:text-white">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="px-4 py-3 text-center border-t border-slate-200 dark:border-slate-700">
                                    <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                                        View all notifications
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Profile Menu */}
                    <div className="relative">
                        <button
                            onClick={() => {
                                setShowProfileMenu(!showProfileMenu);
                                setShowNotifications(false);
                            }}
                            className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-lg">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                    Admin User
                                </p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    admin@futurestore.com
                                </p>
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {showProfileMenu && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                                <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                                    <p className="text-sm font-semibold text-slate-800 dark:text-white">
                                        Admin User
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">
                                        admin@futurestore.com
                                    </p>
                                </div>
                                <div className="py-2">
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </button>
                                </div>
                                <div className="border-t border-slate-200 dark:border-slate-700 py-2">
                                    <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <LogOut className="w-4 h-4" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Click outside to close dropdowns */}
            {(showProfileMenu || showNotifications) && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={() => {
                        setShowProfileMenu(false);
                        setShowNotifications(false);
                    }}
                />
            )}
        </header>
    );
};

export default AdminHeader;

