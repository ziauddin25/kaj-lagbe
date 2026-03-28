"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Globe, Bell, ChevronRight, Star, LogOut, User, Loader2, Shield, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { id: "edit-profile", icon: User, label: "Edit Profile", labelBn: "প্রোফাইল সম্পাদনা", href: "/worker/profile/edit" },
  { id: "my-reviews", icon: Star, label: "My Reviews", labelBn: "আমার রিভিউ", href: "/worker/profile/reviews" },
  { id: "my-services", icon: Award, label: "My Services", labelBn: "আমার সার্ভিস", href: "/worker/profile/services" },
  { id: "verification", icon: Shield, label: "Verification", labelBn: "ভেরিফিকেশন", href: "/worker/profile/verification" },
  { id: "notifications", icon: Bell, label: "Notifications", labelBn: "নোটিফিকেশন", href: "/worker/profile/notifications" },
  { id: "settings", icon: Settings, label: "Settings", labelBn: "সেটিংস", href: "/worker/profile/settings" },
];

interface WorkerStats {
  totalJobs: number;
  rating: number;
  totalReviews: number;
  totalEarnings: number;
}

export default function WorkerProfilePage() {
  const { locale, setLocale } = useI18n();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<WorkerStats>({ totalJobs: 0, rating: 4.8, totalReviews: 0, totalEarnings: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats();
    }
  }, [isAuthenticated]);

  const fetchStats = async () => {
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/providers/${user?.id}/earnings`, {
        headers
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalJobs: data.count || 0,
          rating: 4.8,
          totalReviews: 12,
          totalEarnings: data.total || 0,
        });
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push("/sign-in");
  };

  const toggleLanguage = () => {
    setLocale(locale === 'bn' ? 'en' : 'bn');
  };

  const formatPhone = (phone: string) => {
    if (phone.startsWith('880')) {
      return '+' + phone.slice(0, 3) + ' ' + phone.slice(3);
    }
    return phone;
  };

  return (
    <div className="min-h-screen bg-bg-main pb-5 lg:pb-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-primary px-4 pt-8 pb-12 rounded-b-3xl lg:rounded-3xl"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-white">
              {locale === 'bn' ? 'আমার প্রোফাইল' : 'My Profile'}
            </h1>
            <button className="p-2 rounded-full bg-white/20">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-white/30">
              <AvatarFallback className="bg-white text-primary text-2xl font-bold">
                {user?.name?.charAt(0) || 'W'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'Worker'}</h2>
              <p className="text-white/80 text-sm">{formatPhone(user?.phone || '')}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  {locale === 'bn' ? 'সেবাদাতা' : 'Service Provider'}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-white/90 text-xs font-medium">{stats.rating}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">
                {isLoading ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : stats.totalJobs}
              </p>
              <p className="text-white/80 text-xs">সম্পন্ন কাজ</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">{stats.totalReviews}</p>
              <p className="text-white/80 text-xs">রিভিউ</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">
                ৳{isLoading ? '...' : stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-white/80 text-xs">মোট আয়</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container-custom -mt-6 lg:mt-6">
        <Card className="border-0 shadow-lg rounded-lg">
          <CardContent className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-bg-soft transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bg-soft flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-text-secondary" />
                  </div>
                  <span className="font-medium text-text-primary">
                    {locale === 'bn' ? item.labelBn : item.label}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="mt-4 border-0 shadow-lg rounded-lg">
          <CardContent className="p-2">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-bg-soft transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-soft flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <span className="font-medium text-text-primary">
                  {locale === 'bn' ? 'ভাষা পরিবর্তন' : 'Change Language'}
                </span>
              </div>
              <Badge variant="secondary" className="font-medium">
                {locale === 'bn' ? 'বাংলা' : 'English'}
              </Badge>
            </button>
          </CardContent>
        </Card>

        <Card className="mt-4 border-0 shadow-lg rounded-lg">
          <CardContent className="p-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-red-50 transition-colors text-red-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium">
                  {locale === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                </span>
              </div>
            </button>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            কাজ লাগবে Worker v1.0.0
          </p>
          <p className="text-xs text-text-muted mt-1">
            {locale === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
          </p>
        </div>
      </div>
    </div>
  );
}
