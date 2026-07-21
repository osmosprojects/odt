"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, Menu, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Header({ onMenuClick }: { onMenuClick: () => void }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    setProfileOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 bg-primary text-white shadow-md">
      <div className="h-16 flex items-center justify-between gap-3 px-4 lg:px-6">
        {/* Left Side: Hamburger Menu + Castrol Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
            onClick={onMenuClick}
            aria-label="Toggle Sidebar Navigation"
            title="Toggle Sidebar Menu"
          >
            <Menu size={22} className="text-white" />
          </button>

          <div className="flex items-center">
            <Image
              src="/icons/castrol_logo.png"
              alt="Castrol Logo"
              width={110}
              height={30}
              className="shrink-0 object-contain h-8 w-auto bg-white/10 px-2 py-1 rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Center: Search input */}
        <div className="hidden md:block flex-1 min-w-0 max-w-md mx-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search WBC Offer, Customer Code, SKU Master..."
              className="w-full rounded-full bg-white text-brand-dark text-xs sm:text-sm pl-10 pr-4 py-2 outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-400"
            />
          </div>
        </div>

        {/* Right Side: Notifications & User Profile */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute right-1 top-1 bg-red-500 w-2.5 h-2.5 rounded-full border border-primary" />
          </button>

          <div className="relative">
            <button
              className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 px-2.5 py-1 transition-colors"
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Open profile menu"
            >
              <div className="w-7 h-7 rounded-full bg-white text-primary flex items-center justify-center font-bold text-xs sm:text-sm">
                RM
              </div>
              <span className="hidden md:inline text-xs sm:text-sm font-medium">
                RM Executive User
              </span>
              <ChevronDown size={14} className="hidden md:inline" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-brand-dark rounded-xl shadow-xl border border-gray-100 py-2 text-sm z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-semibold text-xs text-brand-dark">RM Executive User</p>
                  <p className="text-[11px] text-gray-500">rm.user@castrol-odt.com</p>
                </div>

                <button className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-brand-dark font-medium">
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-brand-dark font-medium">
                  Settings
                </button>

                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs hover:bg-gray-50 text-red-500 font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}