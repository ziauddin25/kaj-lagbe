"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Star, Phone, MessageCircle, X, Check, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type TabType = "active" | "history";

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
  providerId: string | null;
  providerName: string | null;
}

const mockProviderPhones: Record<string, string> = {
  'provider_1': '01712345678',
  'provider_2': '01812345678',
  'provider_3': '01912345678',
  'provider_4': '01612345678',
};

const statusConfig: Record<string, { label: string; labelEn: string; variant: string; color: string; bg: string; emoji: string }> = {
  'PENDING': { label: "অপেক্ষায়", labelEn: "Pending", variant: "warning", color: "text-warning", bg: "bg-warning-light", emoji: "⏳" },
  'ACCEPTED': { label: "লোক আসতেছে", labelEn: "Accepted", variant: "default", color: "text-primary", bg: "bg-primary-soft", emoji: "🚀" },
  'ON_THE_WAY': { label: "রাস্তায়", labelEn: "On the way", variant: "default", color: "text-accent", bg: "bg-accent-light", emoji: "🚶" },
  'IN_PROGRESS': { label: "কাজ চলছে", labelEn: "In Progress", variant: "default", color: "text-accent", bg: "bg-accent-light", emoji: "🔧" },
  'COMPLETED': { label: "শেষ", labelEn: "Completed", variant: "success", color: "text-success", bg: "bg-success-light", emoji: "👍" },
  'CANCELLED': { label: "বাতিল", labelEn: "Cancelled", variant: "secondary", color: "text-text-muted", bg: "bg-gray-100", emoji: "❌" },
  'REJECTED': { label: "রিজেক্ট", labelEn: "Rejected", variant: "secondary", color: "text-red-500", bg: "bg-red-50", emoji: "😞" },
};

export default function BookingsScreen() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const userId = user?.id || 'guest';
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/user/${userId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setBookings(data.map((b: any) => ({
          id: b.id,
          categoryName: b.category?.name || 'Service',
          categoryNameBn: b.category?.nameBn || 'সার্ভিস',
          status: b.status,
          description: b.description || '',
          address: b.address || '',
          phone: b.user?.phone || '',
          area: b.area || '',
          estimatedPrice: b.estimatedPrice || 0,
          finalPrice: b.finalPrice || null,
          createdAt: b.createdAt,
          providerId: b.provider?.id || null,
          providerName: b.provider?.user?.name || null,
        })));
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers,
      });
    } catch {
      console.log('Backend not available, cancelling locally');
    }
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
  };

  const activeBookings = bookings.filter(b => ['PENDING', 'ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS'].includes(b.status));
  const historyBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED', 'REJECTED'].includes(b.status));
  const displayBookings = activeTab === "active" ? activeBookings : historyBookings;

  const canShowContact = (status: string) => {
    return ['ACCEPTED', 'ON_THE_WAY', 'IN_PROGRESS', 'COMPLETED'].includes(status);
  };

  const getProviderPhone = (booking: Booking) => {
    if (booking.providerId && mockProviderPhones[booking.providerId]) {
      return mockProviderPhones[booking.providerId];
    }
    return '01700000000';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20 lg:pb-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 pt-6 pb-4"
      >
        <h1 className="text-2xl font-bold text-text-primary">
          {locale === 'bn' ? 'আমার বুকিং' : 'My Bookings'}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {locale === 'bn' ? 'আপনার সব বুকিং এখানে' : 'All your bookings here'}
        </p>
      </motion.div>

      <div className="px-4 mb-4">
        <div className="flex bg-bg-soft rounded-xl p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === "active" 
                ? "bg-white text-primary shadow-sm" 
                : "text-text-secondary"
            )}
          >
            {locale === 'bn' ? 'চলমান' : 'Active'}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={cn(
              "flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === "history" 
                ? "bg-white text-primary shadow-sm" 
                : "text-text-secondary"
            )}
          >
            {locale === 'bn' ? 'ইতিহাস' : 'History'}
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : displayBookings.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-4">📋</div>
            <p className="text-lg font-medium text-text-primary">
              {activeTab === "active" 
                ? (locale === 'bn' ? 'কোনো চলমান বুকিং নেই' : 'No active bookings')
                : (locale === 'bn' ? 'কোনো ইতিহাস নেই' : 'No history')}
            </p>
          </motion.div>
        ) : (
          displayBookings.map((booking, index) => {
            const status = statusConfig[booking.status] || statusConfig['PENDING'];
            
            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
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

                    {booking.providerName && (
                      <div className="flex items-center gap-3 p-3 bg-bg-soft rounded-xl mb-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-primary-soft text-primary text-sm">
                            {booking.providerName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-text-primary text-sm">{booking.providerName}</p>
                          <p className="text-xs text-text-muted">
                            {locale === 'bn' ? 'সার্ভিস প্রোভাইডার' : 'Service Provider'}
                          </p>
                        </div>
                        
                        {canShowContact(booking.status) && (
                          <div className="flex gap-2">
                            <a 
                              href={`tel:${getProviderPhone(booking)}`}
                              className="w-9 h-9 rounded-full bg-success-light flex items-center justify-center"
                            >
                              <Phone className="w-4 h-4 text-success" />
                            </a>
                            <a 
                              href={`sms:${getProviderPhone(booking)}`}
                              className="w-9 h-9 rounded-full bg-accent-light flex items-center justify-center"
                            >
                              <MessageCircle className="w-4 h-4 text-accent" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{booking.address}</span>
                    </div>

                    {booking.description && (
                      <div className="text-sm text-text-secondary mb-3 bg-gray-50 p-2 rounded-lg">
                        {booking.description}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-text-muted">
                        <Clock className="w-4 h-4" />
                        <span>{locale === 'bn' ? 'আনুমানিক' : 'Est.'}: ৳{booking.estimatedPrice}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          ৳{booking.finalPrice || booking.estimatedPrice}
                        </p>
                      </div>
                    </div>

                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2 mt-3">
                        <Button 
                          variant="secondary" 
                          className="flex-1"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          {locale === 'bn' ? 'বিস্তারিত' : 'Details'}
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          {locale === 'bn' ? 'বাতিল' : 'Cancel'}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBooking(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-text-primary">
                {locale === 'bn' ? 'বুকিং বিস্তারিত' : 'Booking Details'}
              </h3>
              <button onClick={() => setSelectedBooking(null)} className="p-1">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-text-secondary">{locale === 'bn' ? 'সার্ভিস' : 'Service'}</span>
                <span className="font-medium">{locale === 'bn' ? selectedBooking.categoryNameBn : selectedBooking.categoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{locale === 'bn' ? 'ঠিকানা' : 'Address'}</span>
                <span className="font-medium text-right max-w-[150px]">{selectedBooking.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-secondary">{locale === 'bn' ? 'ফোন' : 'Phone'}</span>
                <span className="font-medium">{selectedBooking.phone}</span>
              </div>
              {selectedBooking.description && (
                <div className="flex justify-between">
                  <span className="text-text-secondary">{locale === 'bn' ? 'সমস্যা' : 'Problem'}</span>
                  <span className="font-medium text-right max-w-[150px]">{selectedBooking.description}</span>
                </div>
              )}
            </div>

            <Button 
              className="w-full mt-6"
              variant="destructive"
              onClick={() => {
                handleCancelBooking(selectedBooking.id);
                setSelectedBooking(null);
              }}
            >
              {locale === 'bn' ? 'বুকিং বাতিল করুন' : 'Cancel Booking'}
            </Button>
          </motion.div>
        </div>
      )}
    </div>
  );
}