"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { WorkerBottomNav } from "@/components/layout/worker-bottom-nav";
import { useAuth } from "@/lib/auth-context";

const noNavRoutes = ["/", "/sign-in", "/sign-up"];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && user) {
      const isWorkerRoute = pathname.startsWith('/worker');
      const isUserRoute = !isWorkerRoute && !noNavRoutes.includes(pathname);

      if (user.role === 'PROVIDER' && isUserRoute) {
        router.push('/worker/home');
      }
      if (user.role === 'USER' && isWorkerRoute) {
        router.push('/home');
      }
    }
  }, [mounted, user, pathname, router]);

  if (!mounted) return null;

  const showNav = !noNavRoutes.includes(pathname);
  const isWorkerRoute = pathname.startsWith('/worker');

  return (
    <div className="min-h-screen bg-bg-main pb-20">
      {children}
      {showNav && (isWorkerRoute ? <WorkerBottomNav /> : <BottomNav />)}
    </div>
  );
}
