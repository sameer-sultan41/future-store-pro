import { Metadata } from "next";
import { redirect } from "next/navigation";

import AdminSidebar from "@/domains/admin/components/sidebar/AdminSidebar";
import AdminHeader from "@/domains/admin/components/header/AdminHeader";
import AdminProvider from "@/domains/admin/components/AdminProvider";
import AdminPageLayoutWrapper from "@/domains/admin/components/layout/AdminPageLayoutWrapper";
import { createSupabaseServer } from "@/shared/lib/supabaseClient";

export const metadata: Metadata = {
  title: "Admin Dashboard - Future Store",
  description: "Admin dashboard for managing Future Store",
};

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const supabase = createSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  // if (!session) redirect("/");

  return (
    <AdminProvider>
      <div className="flex h-screen bg-white dark:bg-slate-900 overflow-hidden">
        {/* Sidebar with independent scroll */}
        <div className="h-screen overflow-y-auto">
          <AdminSidebar />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden">
          <AdminHeader title="Dashboard" />
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Automatically wrap all admin pages with breadcrumbs and structure */}
            <AdminPageLayoutWrapper>
              {children}
            </AdminPageLayoutWrapper>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
};

export default AdminLayout;
