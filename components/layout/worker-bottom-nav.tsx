"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Briefcase, DollarSign, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const navItems = [
  { key: "home", icon: Home, label: "হোম", labelEn: "Home", href: "/worker/home" },
  { key: "jobs", icon: Briefcase, label: "কাজ", labelEn: "Jobs", href: "/worker/jobs" },
  { key: "earnings", icon: DollarSign, label: "আয়", labelEn: "Earnings", href: "/worker/earnings" },
  { key: "profile", icon: User, label: "প্রোফাইল", labelEn: "Profile", href: "/worker/profile" },
];

export function WorkerBottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useI18n();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-card border-t border-gray-100 px-4 py-2 safe-area-bottom z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => router.push(item.href)}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-md transition-colors min-w-[64px]",
                isActive
                  ? "text-primary bg-primary-soft"
                  : "text-text-muted hover:text-text-secondary"
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5",
                  isActive && "fill-primary"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span className="text-xs font-medium">
                {locale === 'bn' ? item.label : item.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
