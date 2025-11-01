"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DollarSign, FileText, Users, Package } from "lucide-react";
import StatCard from "./StatCard";
import EarningStatistics from "./EarningStatistics";
import SalesTarget from "./SalesTarget";
import AllCustomers from "./AllCustomers";
import UserHitRate from "./UserHitRate";
import RecentActivity from "./RecentActivity";
import { RootState } from "@/store/shoppingCart";
import { setStats } from "@/store/adminDashboard";
import { getAllProducts } from "@/actions/product/product";
import { getAllBrands } from "@/actions/brands/brands";
import { getTrafficReport } from "@/actions/pageVisit/pageVisitServices";

const AdminDashboardContent = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

    // Get stats from Redux store
    const stats = useSelector((state: RootState) => state.adminDashboard.stats);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch all necessary data
            const [productsRes, brandsRes, trafficRes] = await Promise.all([
                getAllProducts(),
                getAllBrands(),
                getTrafficReport(0),
            ]);

            // Calculate stats
            const dashboardStats = {
                totalProducts: productsRes.res?.length || 0,
                totalCategories: 12, // This would come from categories API
                totalBrands: brandsRes.res?.length || 0,
                totalTraffic: trafficRes.res?.totalCount || 0,
                recentOrders: 45, // This would come from orders API
                revenue: 12500, // This would come from orders API
                activeUsers: 1250, // This would come from users API
                pendingOrders: 8, // This would come from orders API
            };

            dispatch(setStats(dashboardStats));
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Sample data for charts
    const earningData = [
        { label: "Jan", value: 650 },
        { label: "Feb", value: 720 },
        { label: "Mar", value: 850 },
        { label: "Apr", value: 520 },
        { label: "May", value: 680 },
        { label: "Jun", value: 720 },
        { label: "Jul", value: 6847 },
        { label: "Aug", value: 750 },
    ];

    const customerData = [
        { city: "Dhaka", count: 24435, color: "bg-gradient-to-r from-blue-500 to-blue-400" },
        { city: "Chittagong", count: 26985, color: "bg-gradient-to-r from-cyan-500 to-cyan-400" },
        { city: "Sylhet", count: 26865, color: "bg-gradient-to-r from-purple-500 to-purple-400" },
        { city: "Rajshahi", count: 30749, color: "bg-gradient-to-r from-emerald-500 to-emerald-400" },
    ];

    const hitRateData = [
        { label: "Jan", value: 550 },
        { label: "Feb", value: 620 },
        { label: "Mar", value: 480 },
        { label: "Apr", value: 720 },
        { label: "May", value: 650 },
        { label: "Jun", value: 480 },
        { label: "Jul", value: 580 },
        { label: "Aug", value: 765 },
        { label: "Sep", value: 640 },
        { label: "Oct", value: 520 },
        { label: "Nov", value: 820 },
        { label: "Dec", value: 780 },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Top Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Sales"
                    value={`$${(stats?.revenue || 76964432).toLocaleString()}`}
                    icon={DollarSign}
                    color="purple"
                    trend={{ value: 12.5, isPositive: true }}
                />
                <StatCard
                    title="Total Order"
                    value={stats?.recentOrders || 1645}
                    icon={FileText}
                    color="red"
                    trend={{ value: 8.3, isPositive: true }}
                />
                <StatCard
                    title="Total Customer"
                    value={stats?.activeUsers || 14634}
                    icon={Users}
                    color="blue"
                    trend={{ value: 5.2, isPositive: false }}
                />
                <StatCard
                    title="Total Products"
                    value={stats?.totalProducts || 254}
                    icon={Package}
                    color="green"
                    trend={{ value: 15.3, isPositive: true }}
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Earning Statistics */}
                <div className="lg:col-span-2">
                    <EarningStatistics data={earningData} />
                </div>

                {/* Sales Target */}
                <div className="lg:col-span-1">
                    <SalesTarget
                        dailyTarget={3000}
                        dailyAchieved={1960}
                        monthlyTarget={200000}
                        monthlyAchieved={145000}
                    />
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* User Hit Rate */}
                <div className="lg:col-span-2">
                    <UserHitRate data={hitRateData} />
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-1">
                    <RecentActivity />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardContent;

