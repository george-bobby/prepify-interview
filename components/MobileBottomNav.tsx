"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FileText,
  LayoutDashboard,
  User,
  Briefcase,
} from "lucide-react";

interface MobileBottomNavProps {
  user: any;
}

const MobileBottomNav = ({ user }: MobileBottomNavProps) => {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/home",
      label: "Home",
      icon: Home,
    },
    {
      href: "/interviews",
      label: "Interviews",
      icon: Briefcase,
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/resume",
      label: "Resume",
      icon: FileText,
    },
    {
      href: "/settings",
      label: "Profile",
      icon: User,
    },
  ];

  if (!user) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-100 border-t border-dark-300 backdrop-blur-sm">
      <nav className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                isActive
                  ? "text-primary-200"
                  : "text-light-400 hover:text-primary-100"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${
                  isActive ? "stroke-[2.5]" : "stroke-[2]"
                }`}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MobileBottomNav;
