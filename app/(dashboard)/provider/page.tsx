"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone, MessageCircle, Check, X, Loader2, DollarSign, Star, Briefcase, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface Booking {
  id: string;
  categoryName: string;
  categoryNameBn: string;
  status: string;
  description: string;
  address: string;
  phone: string;
  area: string;
  estimatedPrice: number;
  finalPrice: number | null;
  createdAt: string;
}

const mockProvider = {
  id: "provider_1",
  name: "রহিম ভাই",
  phone: "01712345678",
  rating: 4.8,
  totalJobs: 156,
  earnings: 45600,
  status: "available",
};

const statusConfig: Record<string, { label: string; labelEn: string; variant: string; color: string; bg: string; emoji: string }> = {
  'PENDING': { label: "নতুন বুকিং", labelEn: "New Booking", variant: "warning", color: "text-warning", bg: "bg-warning-light", emoji: "🔔" },
  'ACCEPTED': { label: "অ্যাকসেপ্টেড", labelEn: "Accepted", variant: "default", color: "text-primary", bg: "bg-primary-soft", emoji: "✅" },
  'ON_THE_WAY': { label: "রাস্তায়", labelEn: "On the way", variant: "default", color: "text-accent", bg: "bg-accent-light", emoji: "🚶" },
  'IN_PROGRESS': { label: "কাজ চলছে", labelEn: "In Progress", variant: "default", color: "text-accent", bg: "bg-accent-light", emoji: "🔧" },
  'COMPLETED': { label: "সম্পন্ন", labelEn: "Completed", variant: "success", color: "text-success", bg: "bg-success-light", emoji: "👍" },
  'CANCELLED': { label: "বাতিল", labelEn: "Cancelled", variant: "secondary", color: "text-text-muted", bg: "bg-gray-100", emoji: "❌" },
};

export default function ProviderDashboard() {
  const { t, locale } = useI18n();
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [providerStatus, setProviderStatus] = useState(mockProvider.status);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings?providerId=${mockProvider.id}`);
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      } else {
        setBookings([
          {
            id: "booking_1",
            categoryName: "Electrician",
            categoryNameBn: "ইলেকট্রিশিয়ান",
            status: "PENDING",
            description: "বাড়ির তারে সমস্যা",
            address: "বাড়ি নং ১২, রোড ৫, মিরপুর-১০",
            phone: "01712345678",
            area: "মিরপুর",
            estimatedPrice: 450,
            finalPrice: null,
            createdAt: new Date().toISOString(),
          },
          {
            id: "booking_2",
            categoryName: "Plumber",
            categoryNameBn: "প্লাম্বার",
            status: "ACCEPTED",
            description: "বাথরুমে পাইপ লিক",
            address: "ফ্ল্যাট নং ৫বি, গুলশান",
            phone: "01812345678",
            area: "গুলশান",
            estimatedPrice: 350,
            finalPrice: null,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'ACCEPTED', providerId: mockProvider.id }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to accept booking:', error);
    }
  };

  const handleReject = async (bookingId: string) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to reject booking:', error);
    }
  };

  const handleComplete = async (bookingId: string, finalPrice: number) => {
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'COMPLETED', finalPrice }),
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to complete booking:', error);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const activeBookings = bookings.filter(b => ['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status));
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20 lg:pb-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-primary px-4 pt-8 pb-6 rounded-b-3xl lg:rounded-3xl"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-white">
              {locale === 'bn' ? 'ড্যাশবোর্ড' : 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setProviderStatus(providerStatus === 'available' ? 'offline' : 'available')}
                className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  providerStatus === 'available' 
                    ? "bg-success text-white" 
                    : "bg-gray-400 text-white"
                )}
              >
                {providerStatus === 'available' 
                  ? (locale === 'bn' ? 'অনলাইন' : 'Online')
                  : (locale === 'bn' ? 'অফলাইন' : 'Offline')}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 border-4 border-white/30">
              <AvatarFallback className="bg-white text-primary text-xl font-bold">
                {mockProvider.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">{mockProvider.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-warning fill-warning" />
                <span className="text-white/80 text-sm">{mockProvider.rating} ({mockProvider.totalJobs} {locale === 'bn' ? 'কাজ' : 'jobs'})</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{pendingBookings.length}</p>
              <p className="text-white/70 text-xs">{locale === 'bn' ? 'নতুন' : 'New'}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">{activeBookings.length}</p>
              <p className="text-white/70 text-xs">{locale === 'bn' ? 'চলমান' : 'Active'}</p>
            </div>
            <div className="bg-white/20 rounded-xl p-3 text-center">
              <p className="text-2xl font-bold text-white">৳{mockProvider.earnings}</p>
              <p className="text-white/70 text-xs">{locale === 'bn' ? 'আয়' : 'Earnings'}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* New Bookings */}
      <div className="container-custom mt-4">
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          {locale === 'bn' ? 'নতুন বুকিং' : 'New Bookings'}
        </h3>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : pendingBookings.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">😴</div>
              <p className="text-text-muted">
                {locale === 'bn' ? 'কোনো নতুন বুকিং নেই' : 'No new bookings'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {pendingBookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig['PENDING'];
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className={cn("h-1", status.bg)} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{status.emoji}</span>
                        <div>
                          <p className="font-semibold text-text-primary">
                            {locale === 'bn' ? booking.categoryNameBn : booking.categoryName}
                          </p>
                          <p className="text-xs text-text-muted">{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                      <Badge variant={status.variant as any} className={status.color}>
                        {locale === 'bn' ? status.label : status.labelEn}
                      </Badge>
                    </div>

                    <div className="bg-bg-soft rounded-xl p-3 mb-3">
                      <p className="text-sm text-text-secondary mb-2">{booking.description || 'কোনো বিবরণ নেই'}</p>
                      <div className="flex items-center gap-1 text-sm text-text-muted">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{booking.address}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4 text-text-muted" />
                        <span className="text-sm font-medium text-primary">{booking.phone}</span>
                      </div>
                      <p className="text-lg font-bold text-primary">৳{booking.estimatedPrice}</p>
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button 
                        className="flex-1"
                        onClick={() => handleAccept(booking.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        {locale === 'bn' ? 'অ্যাকসেপ্ট' : 'Accept'}
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-red-500 border-red-200"
                        onClick={() => handleReject(booking.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        {locale === 'bn' ? 'রিজেক্ট' : 'Reject'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Jobs */}
      <div className="container-custom mt-6">
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          {locale === 'bn' ? 'চলমান কাজ' : 'Active Jobs'}
        </h3>
        
        {activeBookings.length === 0 ? (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-text-muted">
                {locale === 'bn' ? 'কোনো চলমান কাজ নেই' : 'No active jobs'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {activeBookings.map((booking) => {
              const status = statusConfig[booking.status] || statusConfig['ACCEPTED'];
              return (
                <Card key={booking.id} className="overflow-hidden">
                  <div className={cn("h-1", status.bg)} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{status.emoji}</span>
                        <div>
                          <p className="font-semibold text-text-primary">
                            {locale === 'bn' ? booking.categoryNameBn : booking.categoryName}
                          </p>
                          <p className="text-xs text-text-muted">{formatDate(booking.createdAt)}</p>
                        </div>
                      </div>
                      <Badge variant={status.variant as any} className={status.color}>
                        {locale === 'bn' ? status.label : status.labelEn}
                      </Badge>
                    </div>

                    <div className="bg-bg-soft rounded-xl p-3 mb-3">
                      <div className="flex items-center gap-1 text-sm text-text-secondary mb-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{booking.address}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="w-4 h-4 text-success" />
                        <span className="font-medium">{booking.phone}</span>
                      </div>
                    </div>

                    <Button 
                      className="w-full"
                      onClick={() => handleComplete(booking.id, booking.estimatedPrice)}
                    >
                      <Check className="w-4 h-4 mr-1" />
                      {locale === 'bn' ? 'কাজ সম্পন্ন করুন' : 'Mark Complete'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Today */}
      <div className="container-custom mt-6 pb-8">
        <h3 className="text-lg font-semibold text-text-primary mb-3">
          {locale === 'bn' ? 'আজকের সম্পন্ন কাজ' : 'Completed Today'}
        </h3>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success">{completedBookings.length}</p>
                <p className="text-sm text-text-muted">
                  {locale === 'bn' ? 'টি কাজ সম্পন্ন' : 'jobs completed'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  ৳{completedBookings.reduce((sum, b) => sum + (b.finalPrice || b.estimatedPrice), 0)}
                </p>
                <p className="text-sm text-text-muted">
                  {locale === 'bn' ? 'আজকের আয়' : "Today's earnings"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}