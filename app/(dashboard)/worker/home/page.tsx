"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Check, X, Loader2, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";

interface BookingRequest {
  id: string;
  customerName: string;
  customerPhone: string;
  categoryName: string;
  categoryNameBn: string;
  description: string;
  address: string;
  area: string;
  estimatedPrice: number;
  createdAt: string;
  status: string;
}

const mockRequests: BookingRequest[] = [
  {
    id: 'req_1',
    customerName: 'তানভীর হাসান',
    customerPhone: '01711111111',
    categoryName: 'Electrician',
    categoryNameBn: 'ইলেকট্রিশিয়ান',
    description: 'ফ্যানের তার পোড়া হয়ে গেছে, নতুন তার লাগবে',
    address: 'বাসা ১২, রোড ৫, ব্লক সি',
    area: 'মিরপুর ১০',
    estimatedPrice: 500,
    createdAt: new Date().toISOString(),
    status: 'PENDING',
  },
  {
    id: 'req_2',
    customerName: 'সাদিয়া আক্তার',
    customerPhone: '01822222222',
    categoryName: 'Plumber',
    categoryNameBn: 'প্লাম্বার',
    description: 'বাথরুমের পাইপ লিক করছে',
    address: 'ফ্ল্যাট ৩বি, বাড়ি ৮',
    area: 'উত্তরা',
    estimatedPrice: 350,
    createdAt: new Date(Date.now() - 600000).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'req_3',
    customerName: 'রাকিব হোসেন',
    customerPhone: '01933333333',
    categoryName: 'AC Repair',
    categoryNameBn: 'এসি মেরামত',
    description: 'AC ঠান্ডা হচ্ছে না, গ্যাস শেষ হয়ে গেছে মনে হচ্ছে',
    address: 'হাউজ ৪৫, সেক্টর ৭',
    area: 'উত্তরা',
    estimatedPrice: 1200,
    createdAt: new Date(Date.now() - 1200000).toISOString(),
    status: 'PENDING',
  },
  {
    id: 'req_4',
    customerName: 'ফারহানা খান',
    customerPhone: '01644444444',
    categoryName: 'Electrician',
    categoryNameBn: 'ইলেকট্রিশিয়ান',
    description: 'মেইন সুইচবোর্ড থেকে স্পার্ক হচ্ছে',
    address: 'বাসা ২২, লেন ৩',
    area: 'ধানমন্ডি',
    estimatedPrice: 800,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    status: 'PENDING',
  },
];

export default function WorkerHomePage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/pending`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRequests(data.map((b: any) => ({
            id: b.id,
            customerName: b.user?.name || 'Unknown',
            customerPhone: b.user?.phone || '',
            categoryName: b.category?.name || 'Service',
            categoryNameBn: b.category?.nameBn || 'সার্ভিস',
            description: b.description || '',
            address: b.address || '',
            area: b.area || '',
            estimatedPrice: b.estimatedPrice || 0,
            createdAt: b.createdAt,
            status: b.status,
          })));
        } else {
          setRequests(mockRequests);
        }
      } else {
        setRequests(mockRequests);
      }
    } catch (error) {
      console.error('Failed to fetch requests:', error);
      setRequests(mockRequests);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const providerRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/me`, { headers });
      let providerId = user?.id;
      if (providerRes.ok) {
        const meData = await providerRes.json();
        if (meData.provider?.id) providerId = meData.provider.id;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/${requestId}/assign`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ providerId }),
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== requestId));
      }
    } catch (error) {
      console.error('Failed to accept:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/${requestId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'REJECTED' }),
      });
      if (res.ok) {
        setRequests(prev => prev.filter(r => r.id !== requestId));
      }
    } catch (error) {
      console.error('Failed to reject:', error);
    } finally {
      setProcessingId(null);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'এখনই';
    if (mins < 60) return `${mins} মিনিট আগে`;
    const hours = Math.floor(mins / 60);
    return `${hours} ঘণ্টা আগে`;
  };

  const getGreeting = () => {
    const firstName = user?.name?.split(' ')[0] || '';
    return `${firstName}, নতুন রিকোয়েস্ট আছে!`;
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary px-4 pt-8 pb-12 rounded-b-3xl lg:rounded-3xl"
      >
        <div className="container-custom">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/80 text-sm">
                {locale === 'bn' ? 'সেবাদাতা ড্যাশবোর্ড' : 'Worker Dashboard'}
              </p>
              <h1 className="text-2xl font-bold text-white mt-1">{getGreeting()}</h1>
            </div>
            <div className="relative">
              <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </button>
              {requests.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">
                  {requests.length}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">{requests.length}</p>
              <p className="text-white/80 text-xs">নতুন রিকোয়েস্ট</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">3</p>
              <p className="text-white/80 text-xs">চলমান কাজ</p>
            </div>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-xl font-bold text-white">৳12,500</p>
              <p className="text-white/80 text-xs">এই মাসে</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container-custom mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {locale === 'bn' ? 'নতুন রিকোয়েস্ট' : 'New Requests'}
          </h2>
          {requests.length > 0 && (
            <Badge variant="warning" className="text-xs">
              {requests.length} টি অপেক্ষমাণ
            </Badge>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-lg font-medium text-text-primary">
              {locale === 'bn' ? 'কোনো নতুন রিকোয়েস্ট নেই' : 'No new requests'}
            </p>
            <p className="text-sm text-text-muted mt-1">
              {locale === 'bn' ? 'নতুন রিকোয়েস্ট আসলে এখানে দেখাবে' : 'New requests will appear here'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-2 rounded-lg border-transparent hover:border-primary/20 transition-colors">
                  <div className="h-1 bg-gradient-to-r from-warning to-orange-400" />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                          <Zap className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-sm">
                            {locale === 'bn' ? request.categoryNameBn : request.categoryName}
                          </p>
                          <p className="text-xs text-text-muted">{getTimeAgo(request.createdAt)}</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-primary">৳{request.estimatedPrice}+</p>
                    </div>

                    <div className="mb-3">
                      <p className="text-sm text-text-secondary">{request.description}</p>
                    </div>

                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-primary-soft text-primary text-xs">
                          {request.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-text-primary">{request.customerName}</p>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <MapPin className="w-3 h-3" />
                          <span>{request.area}</span>
                        </div>
                      </div>
                      <a
                        href={`tel:${request.customerPhone}`}
                        className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center"
                      >
                        <Phone className="w-4 h-4 text-primary" />
                      </a>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleReject(request.id)}
                        disabled={processingId === request.id}
                      >
                        {processingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <X className="w-4 h-4 mr-1" /> রিজেক্ট
                          </>
                        )}
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => handleAccept(request.id)}
                        disabled={processingId === request.id}
                      >
                        {processingId === request.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Check className="w-4 h-4 mr-1" /> একসেপ্ট
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
