"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Settings, Globe, Bell, ChevronRight, Star, LogOut, User, History, CreditCard, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { id: "edit-profile", icon: User, label: "Edit Profile", labelBn: "প্রোফাইল সম্পাদনা", href: "/profile/edit" },
  { id: "my-reviews", icon: Star, label: "My Reviews", labelBn: "আমার রিভিউ", href: "/profile/reviews" },
  { id: "history", icon: History, label: "Booking History", labelBn: "বুকিং ইতিহাস", href: "/bookings" },
  { id: "payment", icon: CreditCard, label: "Payment Methods", labelBn: "পেমেন্ট মেথড", href: "/profile/payment" },
  { id: "notifications", icon: Bell, label: "Notifications", labelBn: "নোটিফিকেশন", href: "/profile/notifications" },
  { id: "settings", icon: Settings, label: "Settings", labelBn: "সেটিংস", href: "/profile/settings" },
];

interface UserStats {
  totalBookings: number;
  totalReviews: number;
}

export default function ProfileScreen() {
  const { t, locale, setLocale } = useI18n();
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats>({ totalBookings: 0, totalReviews: 0 });
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/user/${user?.id}`, {
        headers
      });
      const bookings = await res.json();
      setStats({
        totalBookings: bookings.length || 0,
        totalReviews: 0,
      });
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
    <div className="min-h-screen bg-bg-main pb-20 lg:pb-8">
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
                {user?.name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name || 'User'}</h2>
              <p className="text-white/80 text-sm">{formatPhone(user?.phone || '')}</p>
              <p className="text-white/60 text-xs mt-1">
                {user?.role === 'PROVIDER' 
                  ? (locale === 'bn' ? 'সার্ভিস প্রোভাইডার' : 'Service Provider')
                  : (locale === 'bn' ? 'সদস্য' : 'Member')}
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <div className="flex-1 bg-white/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">
                {isLoading ? <Loader2 className="w-6 h-6 mx-auto animate-spin" /> : stats.totalBookings}
              </p>
              <p className="text-white/80 text-xs">
                {locale === 'bn' ? 'মোট বুকিং' : 'Total Bookings'}
              </p>
            </div>
            <div className="flex-1 bg-white/20 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{stats.totalReviews}</p>
              <p className="text-white/80 text-xs">
                {locale === 'bn' ? 'রিভিউ' : 'Reviews'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container-custom -mt-6 lg:mt-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-bg-soft transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-bg-soft flex items-center justify-center">
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

        <Card className="mt-4 border-0 shadow-lg">
          <CardContent className="p-2">
            <button
              onClick={toggleLanguage}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-bg-soft transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
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

        <Card className="mt-4 border-0 shadow-lg">
          <CardContent className="p-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-red-50 transition-colors text-red-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-500" />
                </div>
                <span className="font-medium">
                  {locale === 'bn' ? 'সাইন আউট' : 'Sign Out'}
                </span>
              </div>
            </button>
          </CardContent>
        </Card>

        <div className="text-center mt-8 pb-8">
          <p className="text-sm text-text-muted">
            কাজ লাগবে v1.0.0
          </p>
          <p className="text-xs text-text-muted mt-1">
            {locale === 'bn' ? 'ঢাকা, বাংলাদেশ' : 'Dhaka, Bangladesh'}
          </p>
        </div>
      </div>
    </div>
  );
}