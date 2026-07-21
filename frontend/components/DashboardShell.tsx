"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileBottomNav from "./MobileBottomNav";
import Footer from "./Footer";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f4f6f8] relative">
      {/* Overlay Navigation Drawer */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Full-width Main App Layout */}
      <div className="flex-1 flex flex-col min-w-0 w-full">
        <Header onMenuClick={toggleSidebar} />

        <main className="flex-1 p-4 sm:p-6 pb-24 lg:pb-6 space-y-4 sm:space-y-6 w-full max-w-7xl mx-auto">
          {children}
        </main>

        <Footer />
      </div>

      <MobileBottomNav onMenuClick={toggleSidebar} />
    </div>
  );
}
