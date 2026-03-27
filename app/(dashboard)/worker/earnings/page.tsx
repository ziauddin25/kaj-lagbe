"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar, Loader2, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface EarningRecord {
  id: string;
  customerName: string;
  categoryName: string;
  categoryNameBn: string;
  amount: number;
  date: string;
  status: string;
}

interface EarningsSummary {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  totalJobs: number;
}

const mockSummary: EarningsSummary = {
  today: 850,
  thisWeek: 3200,
  thisMonth: 12500,
  total: 45800,
  totalJobs: 67,
};

const mockHistory: EarningRecord[] = [
  { id: 'e1', customerName: 'তানভীর হাসান', categoryName: 'Electrician', categoryNameBn: 'ইলেকট্রিশিয়ান', amount: 500, date: new Date().toISOString(), status: 'COMPLETED' },
  { id: 'e2', customerName: 'সাদিয়া আক্তার', categoryName: 'Plumber', categoryNameBn: 'প্লাম্বার', amount: 350, date: new Date(Date.now() - 3600000).toISOString(), status: 'COMPLETED' },
  { id: 'e3', customerName: 'রাকিব হোসেন', categoryName: 'AC Repair', categoryNameBn: 'এসি মেরামত', amount: 1500, date: new Date(Date.now() - 86400000).toISOString(), status: 'COMPLETED' },
  { id: 'e4', customerName: 'ফারহানা খান', categoryName: 'Electrician', categoryNameBn: 'ইলেকট্রিশিয়ান', amount: 700, date: new Date(Date.now() - 172800000).toISOString(), status: 'COMPLETED' },
  { id: 'e5', customerName: 'ইমরান হোসেন', categoryName: 'Plumber', categoryNameBn: 'প্লাম্বার', amount: 450, date: new Date(Date.now() - 259200000).toISOString(), status: 'COMPLETED' },
  { id: 'e6', customerName: 'নাজমুল হাসান', categoryName: 'Mechanic', categoryNameBn: 'মেকানিক', amount: 600, date: new Date(Date.now() - 345600000).toISOString(), status: 'COMPLETED' },
  { id: 'e7', customerName: 'সুমাইয়া বেগম', categoryName: 'Cleaner', categoryNameBn: 'ক্লিনার', amount: 400, date: new Date(Date.now() - 432000000).toISOString(), status: 'COMPLETED' },
];

export default function WorkerEarningsPage() {
  const { locale } = useI18n();
  const { user } = useAuth();
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [history, setHistory] = useState<EarningRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    setIsLoading(true);
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/providers/${user?.id}/earnings`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data && data.total !== undefined) {
          setSummary({
            today: data.today || 0,
            thisWeek: data.thisWeek || 0,
            thisMonth: data.thisMonth || 0,
            total: data.total || 0,
            totalJobs: data.count || 0,
          });
        } else {
          setSummary(mockSummary);
        }
      } else {
        setSummary(mockSummary);
      }
      setHistory(mockHistory);
    } catch (error) {
      console.error('Failed to fetch earnings:', error);
      setSummary(mockSummary);
      setHistory(mockHistory);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'আজ';
    if (date.toDateString() === yesterday.toDateString()) return 'গতকাল';
    return date.toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' });
  };

  const getDisplayAmount = () => {
    if (!summary) return 0;
    switch (selectedPeriod) {
      case "today": return summary.today;
      case "week": return summary.thisWeek;
      case "month": return summary.thisMonth;
      default: return summary.thisMonth;
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20 lg:pb-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary px-4 pt-8 pb-12 rounded-b-3xl lg:rounded-3xl"
      >
        <div className="container-custom">
          <p className="text-white/80 text-sm">
            {locale === 'bn' ? 'আমার আয়' : 'My Earnings'}
          </p>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : (
            <>
              <div className="flex items-baseline gap-2 mt-2">
                <h1 className="text-4xl font-bold text-white">৳{getDisplayAmount().toLocaleString()}</h1>
                <Badge className="bg-white/20 text-white border-0 text-xs">
                  {selectedPeriod === "today" ? "আজ" : selectedPeriod === "week" ? "এই সপ্তাহ" : "এই মাস"}
                </Badge>
              </div>

              <div className="flex gap-2 mt-4">
                {[
                  { key: "today", label: "আজ" },
                  { key: "week", label: "সপ্তাহ" },
                  { key: "month", label: "মাস" },
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() => setSelectedPeriod(period.key)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                      selectedPeriod === period.key
                        ? "bg-white text-primary"
                        : "bg-white/20 text-white hover:bg-white/30"
                    )}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>

      <div className="container-custom -mt-6 lg:mt-6">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-2">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                ৳{summary?.total.toLocaleString() || 0}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {locale === 'bn' ? 'সর্বমোট আয়' : 'Total Earnings'}
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-4 text-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-2">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-text-primary">
                {summary?.totalJobs || 0}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {locale === 'bn' ? 'সর্বমোট কাজ' : 'Total Jobs'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {locale === 'bn' ? 'আয়ের ইতিহাস' : 'Earnings History'}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-text-muted" />
            </div>
            <p className="text-lg font-medium text-text-primary">
              {locale === 'bn' ? 'কোনো আয়ের ইতিহাস নেই' : 'No earnings history'}
            </p>
          </div>
        ) : (
          <Card className="border-0 shadow-lg">
            <CardContent className="p-0 divide-y divide-gray-100">
              {history.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary-soft flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary text-sm">
                        {locale === 'bn' ? record.categoryNameBn : record.categoryName}
                      </p>
                      <p className="text-xs text-text-muted">
                        {record.customerName} • {formatDate(record.date)}
                      </p>
                    </div>
                  </div>
                  <p className="text-lg font-bold text-primary">+৳{record.amount}</p>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
