"use client";

import { usePathname, useRouter } from "next/navigation";
import { Home, Search, Calendar, User, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

const userNavItems = [
  { key: "home", icon: Home, href: "/home" },
  { key: "search", icon: Search, href: "/search" },
  { key: "bookings", icon: Calendar, href: "/bookings" },
  { key: "profile", icon: User, href: "/profile" },
];

const providerNavItems = [
  { key: "provider", icon: Briefcase, href: "/provider" },
  { key: "bookings", icon: Calendar, href: "/bookings" },
  { key: "profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const { user } = useAuth();
  
  const isProviderPage = pathname.startsWith('/provider');
  const navItems = isProviderPage ? providerNavItems : userNavItems;

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
                {item.key === 'provider' ? (t('locale') === 'bn' ? 'কাজ' : 'Jobs') : t(`nav.${item.key}`)}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}