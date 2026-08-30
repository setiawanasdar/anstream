import React from "react";
import { DesktopGuard } from "@/components/admin/DesktopGuard";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Dashboard - NontonAnime",
  description: "Panel Administrator Pengelolaan Platform Streaming NontonAnime",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <DesktopGuard>
      <div className="flex min-h-screen bg-[#070b12] text-[#f1f5f9]">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full">
            {children}
          </main>
        </div>
      </div>
    </DesktopGuard>
  );
}
