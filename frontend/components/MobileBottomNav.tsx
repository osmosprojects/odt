"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  ListTodo,
  ShieldCheck,
  FileBarChart,
  Menu,
} from "lucide-react";

const items = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "To Do", icon: ListTodo, href: "/to-do-list" },
  { label: "Approvals", icon: ShieldCheck, href: "/approvals" },
  { label: "Reports", icon: FileBarChart, href: "/reports-analytics" },
  { label: "Menu", icon: Menu },
];

export default function MobileBottomNav({
  onMenuClick,
}: {
  onMenuClick: () => void;
}) {
  const [active, setActive] = useState("Home");

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 bg-white/98 backdrop-blur border-t border-gray-200 flex items-stretch pb-[env(safe-area-inset-bottom)]">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.label;

        if (item.label === "Menu") {
          return (
            <button
              key={item.label}
              onClick={() => {
                setActive(item.label);
                onMenuClick();
              }}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
                isActive ? "text-primary" : "text-brand-gray"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href!}
            onClick={() => setActive(item.label)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
              isActive ? "text-primary" : "text-brand-gray"
            }`}
          >
            <Icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}