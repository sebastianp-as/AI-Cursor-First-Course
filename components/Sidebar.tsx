"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, PlusCircle, Settings, LayoutDashboard } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import type { Route } from "next";

type NavItem = {
  href: Route;
  label: string;
  icon: any;
};

const nav: NavItem[] = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-transaction", label: "Add Transaction", icon: PlusCircle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/settings", label: "Settings", icon: Settings }
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:gap-4 p-4">
      <div className="flex items-center justify-between mb-2">
        <Link href="/" className="font-semibold text-lg tracking-tight">
          Finance AI
        </Link>
        <ThemeToggle />
      </div>
      <nav className="space-y-1">
        {nav.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`glass flex items-center gap-3 px-3 py-2 transition border ${
                active
                  ? "ring-2 ring-indigo-500/40"
                  : "hover:bg-white/50 dark:hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

