"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Phone, MessageCircle, Play, CheckCircle, Loader2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

type TabType = "active" | "completed";

interface Job {
  id: string;
  customerName: string;
  customerPhone: string;
  categoryName: string;
  categoryNameBn: string;
  description: string;
  address: string;
  area: string;
  estimatedPrice: number;
  finalPrice: number | null;
  status: string;
  createdAt: string;
}

const statusConfig: Record<string, { label: string; labelEn: string; color: string; bg: string; emoji: string }> = {
  'ACCEPTED': { label: "গ্রহণ করা হয়েছে", labelEn: "Accepted", color: "text-primary", bg: "bg-primary-soft", emoji: "✅" },
  'ON_THE_WAY': { label: "রাস্তায়", labelEn: "On the way", color: "text-accent", bg: "bg-accent-light", emoji: "🚶" },
  'IN_PROGRESS': { label: "কাজ চলছে", labelEn: "In Progress", color: "text-warning", bg: "bg-yellow-50", emoji: "🔧" },
  'COMPLETED': { label: "সম্পন্ন", labelEn: "Completed", color: "text-success", bg: "bg-success-light", emoji: "👍" },
};

const mockActiveJobs: Job[] = [
  {
    id: 'job_1',
    customerName: 'তানভীর হাসান',
    customerPhone: '01711111111',
    categoryName: 'Electrician',
    categoryNameBn: 'ইলেকট্রিশিয়ান',
    description: 'ফ্যানের তার পোড়া হয়ে গেছে',
    address: 'বাসা ১২, রোড ৫, ব্লক সি',
    area: 'মিরপুর ১০',
    estimatedPrice: 500,
    finalPrice: null,
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'job_2',
    customerName: 'সাদিয়া আক্তার',
    customerPhone: '01822222222',
    categoryName: 'Plumber',
    categoryNameBn: 'প্লাম্বার',
    description: 'বাথরুমের পাইপ লিক করছে',
    address: 'ফ্ল্যাট ৩বি, বাড়ি ৮',
    area: 'উত্তরা',
    estimatedPrice: 350,
    finalPrice: null,
    status: 'IN_PROGRESS',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

const mockCompletedJobs: Job[] = [
  {
    id: 'job_3',
    customerName: 'রাকিব হোসেন',
    customerPhone: '01933333333',
    categoryName: 'AC Repair',
    categoryNameBn: 'এসি মেরামত',
    description: 'AC গ্যাস রিফিল',
    address: 'হাউজ ৪৫, সেক্টর ৭',
    area: 'উত্তরা',
    estimatedPrice: 1200,
    finalPrice: 1500,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'job_4',
    customerName: 'ফারহানা খান',
    customerPhone: '01644444444',
    categoryName: 'Electrician',
    categoryNameBn: 'ইলেকট্রিশিয়ান',
    description: 'মেইন সুইচবোর্ড মেরামত',
    address: 'বাসা ২২, লেন ৩',
    area: 'ধানমন্ডি',
    estimatedPrice: 800,
    finalPrice: 700,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'job_5',
    customerName: 'ইমরান হোসেন',
    customerPhone: '01555555555',
    categoryName: 'Plumber',
    categoryNameBn: 'প্লাম্বার',
    description: 'টয়লেট ব্লক',
    address: 'বাসা ৮, রোড ৩',
    area: 'মিরপুর',
    estimatedPrice: 400,
    finalPrice: 450,
    status: 'COMPLETED',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
];

export default function WorkerJobsPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [activeJobs, setActiveJobs] = useState<Job[]>([]);
  const [completedJobs, setCompletedJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      let providerId = user?.id;
      const meRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/auth/me`, { headers });
      if (meRes.ok) {
        const meData = await meRes.json();
        if (meData.provider?.id) providerId = meData.provider.id;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/provider/${providerId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((b: any) => ({
            id: b.id,
            customerName: b.user?.name || 'Unknown',
            customerPhone: b.user?.phone || '',
            categoryName: b.category?.name || 'Service',
            categoryNameBn: b.category?.nameBn || 'সার্ভিস',
            description: b.description || '',
            address: b.address || '',
            area: b.area || '',
            estimatedPrice: b.estimatedPrice || 0,
            finalPrice: b.finalPrice || null,
            status: b.status,
            createdAt: b.createdAt,
          }));
          setActiveJobs(mapped.filter((j: Job) => j.status !== 'COMPLETED'));
          setCompletedJobs(mapped.filter((j: Job) => j.status === 'COMPLETED'));
        } else {
          setActiveJobs(mockActiveJobs);
          setCompletedJobs(mockCompletedJobs);
        }
      } else {
        setActiveJobs(mockActiveJobs);
        setCompletedJobs(mockCompletedJobs);
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setActiveJobs(mockActiveJobs);
      setCompletedJobs(mockCompletedJobs);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartJob = async (jobId: string) => {
    setProcessingId(jobId);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/${jobId}/status`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ status: 'IN_PROGRESS' }),
      });
    } catch {
      console.log('Backend not available, updating locally');
    }
    setActiveJobs(prev => prev.map(j => j.id === jobId ? { ...j, status: 'IN_PROGRESS' } : j));
    setProcessingId(null);
  };

  const handleCompleteJob = async (jobId: string) => {
    setProcessingId(jobId);
    const job = activeJobs.find(j => j.id === jobId);
    const finalPrice = job?.estimatedPrice || 0;

    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('auth_token');
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/bookings/${jobId}/complete`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ finalPrice }),
      });
    } catch {
      console.log('Backend not available, updating locally');
    }
    const completedJob = activeJobs.find(j => j.id === jobId);
    if (completedJob) {
      setActiveJobs(prev => prev.filter(j => j.id !== jobId));
      setCompletedJobs(prev => [{ ...completedJob, status: 'COMPLETED' }, ...prev]);
    }
    setProcessingId(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  const displayJobs = activeTab === "active" ? activeJobs : completedJobs;

  return (
    <div className="min-h-screen bg-bg-main pb-3">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-4 pt-6 pb-4"
      >
        <h1 className="text-2xl font-bold text-text-primary">
          {locale === 'bn' ? 'আমার কাজ' : 'My Jobs'}
        </h1>
        <p className="text-sm text-text-secondary mt-1">
          {locale === 'bn' ? 'সব কাজ এখানে দেখুন' : 'View all your jobs here'}
        </p>
      </motion.div>

      <div className="px-4 mb-4">
        <div className="flex bg-bg-soft rounded-full p-1">
          <button
            onClick={() => setActiveTab("active")}
            className={cn(
              "flex-1 py-2.5 rounded-full text-sm font-medium transition-colors",
              activeTab === "active"
                ? "bg-white text-primary shadow-sm"
                : "text-text-secondary"
            )}
          >
            {locale === 'bn' ? 'চলমান' : 'Active'}
            {activeJobs.length > 0 && (
              <span className="ml-1.5 bg-primary-soft text-primary text-xs px-1.5 py-0.5 rounded-full">
                {activeJobs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={cn(
              "flex-1 py-2.5 rounded-full text-sm font-medium transition-colors",
              activeTab === "completed"
                ? "bg-white text-primary shadow-sm"
                : "text-text-secondary"
            )}
          >
            {locale === 'bn' ? 'সম্পন্ন' : 'Completed'}
          </button>
        </div>
      </div>

      <div className="px-4 pb-8 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : displayJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-lg font-medium text-text-primary">
              {activeTab === "active"
                ? (locale === 'bn' ? 'কোনো চলমান কাজ নেই' : 'No active jobs')
                : (locale === 'bn' ? 'কোনো সম্পন্ন কাজ নেই' : 'No completed jobs')}
            </p>
          </motion.div>
        ) : (
          displayJobs.map((job, index) => {
            const status = statusConfig[job.status] || statusConfig['ACCEPTED'];

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden rounded-lg">
                  <div className={cn("h-1", status.bg)} />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{status.emoji}</span>
                        <div>
                          <p className="font-semibold text-text-primary text-sm">
                            {locale === 'bn' ? job.categoryNameBn : job.categoryName}
                          </p>
                          <p className="text-xs text-text-muted">{formatDate(job.createdAt)}</p>
                        </div>
                      </div>
                      <Badge variant={job.status === 'COMPLETED' ? 'success' : 'default'} className={status.color}>
                        {locale === 'bn' ? status.label : status.labelEn}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary-soft text-primary text-sm">
                          {job.customerName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium text-text-primary text-sm">{job.customerName}</p>
                        <div className="flex items-center gap-1 text-xs text-text-muted">
                          <MapPin className="w-3 h-3" />
                          <span>{job.address}, {job.area}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <a
                          href={`tel:${job.customerPhone}`}
                          className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center"
                        >
                          <Phone className="w-4 h-4 text-primary" />
                        </a>
                        <a
                          href={`sms:${job.customerPhone}`}
                          className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center"
                        >
                          <MessageCircle className="w-4 h-4 text-blue-600" />
                        </a>
                      </div>
                    </div>

                    {job.description && (
                      <div className="text-sm text-text-secondary mb-3 bg-gray-50 p-2 rounded-lg">
                        {job.description}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-text-muted">
                        <Clock className="w-4 h-4" />
                        <span>{locale === 'bn' ? 'আনুমানিক' : 'Est.'}: ৳{job.estimatedPrice}</span>
                      </div>
                      <p className="text-lg font-bold text-primary">
                        ৳{job.finalPrice || job.estimatedPrice}
                      </p>
                    </div>

                    {job.status === 'ACCEPTED' && (
                      <Button
                        className="w-full mt-3"
                        onClick={() => handleStartJob(job.id)}
                        disabled={processingId === job.id}
                      >
                        {processingId === job.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Play className="w-4 h-4 mr-2" />
                        )}
                        {locale === 'bn' ? 'কাজ শুরু করুন' : 'Start Job'}
                      </Button>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                      <Button
                        className="w-full mt-3"
                        onClick={() => handleCompleteJob(job.id)}
                        disabled={processingId === job.id}
                      >
                        {processingId === job.id ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        {locale === 'bn' ? 'কাজ শেষ করুন' : 'Complete Job'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
