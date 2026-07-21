"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Tag,
  UserCog,
  BarChart3,
  FileBarChart,
  Calculator,
  CheckSquare,
  ListTodo,
  Sparkles,
  Settings,
  ChevronDown,
} from "lucide-react";
import { sidebarNav, quickLinks, type NavItem } from "@/lib/data";
import Image from "next/image";

const iconMap: Record<string, React.ElementType> = {
  dashboard: LayoutDashboard,
  crm: Users,
  offers: Tag,
  users: UserCog,
  performance: BarChart3,
  reports: FileBarChart,
  tools: Calculator,
  approvals: CheckSquare,
  todo: ListTodo,
  genie: Sparkles,
  admin: Settings,
};

function collectHrefs(item: NavItem): string[] {
  if (item.href) return [item.href];
  if (item.items) return item.items.flatMap(collectHrefs);
  return [];
}

function NavMenuItem({
  item,
  depth,
  pathname,
  expandedMenus,
  setExpandedMenus,
  menuKey,
  onClose,
}: {
  item: NavItem;
  depth: number;
  pathname: string | null;
  expandedMenus: Record<string, boolean>;
  setExpandedMenus: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  menuKey: string;
  onClose: () => void;
}) {
  const Icon = depth === 0 ? iconMap[item.icon ?? ""] ?? LayoutDashboard : null;
  const hasSubItems = !!item.items && item.items.length > 0;
  const isExpanded = expandedMenus[menuKey];

  const descendantHrefs = collectHrefs(item);
  const isActive = hasSubItems
    ? descendantHrefs.includes(pathname ?? "")
    : item.href
    ? pathname === item.href
    : false;

  const baseClasses = `w-full flex items-center justify-between gap-3 rounded-xl font-medium transition-all duration-150
    ${depth === 0 ? "px-3.5 py-2.5 text-sm" : "px-3.5 py-2 text-xs"}
    ${
      isActive && !hasSubItems
        ? "bg-emerald-50 text-primary font-semibold border border-emerald-100"
        : "text-brand-gray hover:bg-gray-50 hover:text-brand-dark"
    }
  `;

  const content = (
    <>
      <span className="flex items-center gap-3">
        {Icon && <Icon size={18} strokeWidth={2} className={isActive ? "text-primary" : "text-gray-400"} />}
        {item.label}
      </span>
      {hasSubItems ? (
        <ChevronDown
          size={14}
          className={`text-brand-gray transition-transform duration-200 ml-auto shrink-0
            ${isExpanded ? "transform rotate-180 text-primary" : "-rotate-90"}
          `}
        />
      ) : item.badge ? (
        <span className="bg-red-500 text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center font-bold shadow-xs">
          {item.badge}
        </span>
      ) : null}
    </>
  );

  return (
    <li className="space-y-0.5">
      {hasSubItems ? (
        <button
          type="button"
          onClick={() =>
            setExpandedMenus((prev) => ({
              ...prev,
              [menuKey]: !prev[menuKey],
            }))
          }
          className={`${baseClasses} ${isActive ? "text-brand-dark font-semibold" : ""}`}
        >
          {content}
        </button>
      ) : item.href ? (
        <Link href={item.href} onClick={onClose} className={baseClasses}>
          {content}
        </Link>
      ) : (
        <button className={baseClasses}>{content}</button>
      )}

      {hasSubItems && (
        <div
          className={`transition-all duration-300 overflow-hidden pl-4 space-y-0.5
            ${isExpanded ? "max-h-96 opacity-100 mt-1" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          <ul className="space-y-0.5">
            {item.items!.map((sub) => (
              <NavMenuItem
                key={sub.label}
                item={sub}
                depth={depth + 1}
                pathname={pathname}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                menuKey={`${menuKey} > ${sub.label}`}
                onClose={onClose}
              />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}

export default function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!pathname) return;
    setExpandedMenus((prev) => {
      const next = { ...prev };
      const walk = (items: NavItem[], parentKey: string) => {
        items.forEach((item) => {
          const key = parentKey ? `${parentKey} > ${item.label}` : item.label;
          if (item.items) {
            const hrefs = collectHrefs(item);
            if (hrefs.includes(pathname)) {
              next[key] = true;
            }
            walk(item.items, key);
          }
        });
      };
      walk(sidebarNav, "");
      return next;
    });
  }, [pathname]);

  return (
    <>
      {/* Semi-transparent dark overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Floating Overlay Drawer Navigation Menu */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-2xl transition-transform duration-300 ease-in-out transform flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header inside overlay drawer with clean Castrol Logo */}
        <div className="flex items-center px-5 h-16 border-b border-gray-100 bg-white shrink-0">
          <Image
            src="/icons/castrol_logo.png"
            alt="Castrol Logo"
            width={110}
            height={30}
            className="h-8 w-auto object-contain"
            priority
          />
        </div>

        {/* Navigation Content Area */}
        <div className="flex-1 overflow-y-auto thin-scroll p-4 space-y-4">
          {/* Main Navigation Card */}
          <nav className="bg-gray-50/60 rounded-2xl border border-gray-100 p-2.5">
            <ul className="space-y-1">
              {sidebarNav.map((item) => (
                <NavMenuItem
                  key={item.label}
                  item={item}
                  depth={0}
                  pathname={pathname}
                  expandedMenus={expandedMenus}
                  setExpandedMenus={setExpandedMenus}
                  menuKey={item.label}
                  onClose={onClose}
                />
              ))}
            </ul>
          </nav>

          {/* Castrol Genie Helper Card */}
          <div className="bg-emerald-50 rounded-2xl p-4 text-center relative overflow-hidden border border-emerald-100">
            <p className="text-xs font-semibold text-brand-dark mb-2.5">
              Need Help with Deals & Matrix?
            </p>
            <button className="w-full flex items-center justify-center gap-2 bg-primary text-white text-xs font-semibold rounded-xl py-2.5 hover:bg-primary-dark transition-colors shadow-sm">
              <Sparkles size={15} strokeWidth={2} />
              Ask Castrol Genie
            </button>
          </div>

          {/* Quick Links */}
          <div className="bg-gray-50/60 rounded-2xl border border-gray-100 p-3.5">
            <p className="text-[11px] font-bold text-brand-gray uppercase tracking-wider mb-2 px-1">
              Quick Links
            </p>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link}>
                  <button
                    onClick={onClose}
                    className="w-full text-left text-xs text-brand-gray hover:text-primary px-2 py-1.5 rounded-lg hover:bg-white transition-colors font-medium"
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}