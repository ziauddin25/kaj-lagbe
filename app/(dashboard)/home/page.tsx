"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Zap, Droplets, Wind, Sparkles, GraduationCap, Wrench, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

const serviceCategories = [
  { id: "electrician", icon: Zap, name: "Electrician", nameBn: "ইলেকট্রিশিয়ান", price: 300, color: "bg-yellow-100 text-yellow-600" },
  { id: "plumber", icon: Droplets, name: "Plumber", nameBn: "প্লাম্বার", price: 250, color: "bg-blue-100 text-blue-600" },
  { id: "ac-repair", icon: Wind, name: "AC Repair", nameBn: "এসি মেরামত", price: 500, color: "bg-cyan-100 text-cyan-600" },
  { id: "cleaner", icon: Sparkles, name: "Cleaner", nameBn: "ক্লিনার", price: 200, color: "bg-purple-100 text-purple-600" },
  { id: "tutor", icon: GraduationCap, name: "Tutor", nameBn: "টিউটর", price: 400, color: "bg-green-100 text-green-600" },
  { id: "mechanic", icon: Wrench, name: "Mechanic", nameBn: "মেকানিক", price: 350, color: "bg-orange-100 text-orange-600" },
];

interface Provider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  jobs: number;
  area: string;
  status: string;
  price: number;
}

const mockProviders: Provider[] = [
  { id: 'p1', name: 'রহিম উদ্দিন', rating: 4.8, jobs: 127, area: 'মিরপুর', status: 'available', price: 300 },
  { id: 'p2', name: 'করিম শেখ', rating: 4.5, jobs: 89, area: 'উত্তরা', status: 'available', price: 250 },
  { id: 'p3', name: 'সুমন হোসেন', rating: 4.9, jobs: 203, area: 'ধানমন্ডি', status: 'busy', price: 500 },
  { id: 'p4', name: 'জাহিদ হাসান', rating: 4.3, jobs: 56, area: 'গুলশান', status: 'available', price: 350 },
  { id: 'p5', name: 'আল-আমিন', rating: 4.7, jobs: 145, area: 'বনানী', status: 'offline', price: 400 },
];

export default function HomeScreen() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [providers, setProviders] = useState<Provider[]>([]);
  const [categories, setCategories] = useState(serviceCategories);
  const [isLoading, setIsLoading] = useState(true);

  const isSearching = searchQuery.trim().length > 0;

  const filteredCategories = categories.filter((c) => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.nameBn.includes(q) || c.id.toLowerCase().includes(q);
  });

  const filteredProviders = providers.filter((p) => {
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.area.toLowerCase().includes(q);
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const headers: Record<string, string> = {};
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const [categoriesRes, providersRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/categories`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}/providers/nearby?latitude=23.8103&longitude=90.4125`, { headers }),
      ]);

      const categoriesData = await categoriesRes.json();
      if (categoriesData.length > 0) {
        setCategories(categoriesData.map((c: any) => ({
          id: c.id,
          name: c.name,
          nameBn: c.nameBn,
          price: c.basePrice,
          color: getCategoryColor(c.name),
        })));
      }

      const providersData = await providersRes.json();
      if (Array.isArray(providersData) && providersData.length > 0) {
        setProviders(providersData.slice(0, 5).map((p: any) => ({
          id: p.id,
          name: p.user?.name || p.userName || 'Unknown',
          avatar: p.user?.avatar || p.userAvatar,
          rating: p.rating || p.avgRating || 4.5,
          jobs: p.totalJobs || p.total_jobs || 0,
          area: p.area || 'Dhaka',
          status: (p.status || 'OFFLINE').toLowerCase(),
          price: p.basePrice || p.base_price || 300,
        })));
      } else {
        setProviders(mockProviders);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setProviders(mockProviders);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (name: string) => {
    const colors: Record<string, string> = {
      'Electrician': 'bg-yellow-100 text-yellow-600',
      'Plumber': 'bg-blue-100 text-blue-600',
      'AC Repair': 'bg-cyan-100 text-cyan-600',
      'Cleaner': 'bg-purple-100 text-purple-600',
      'Tutor': 'bg-green-100 text-green-600',
      'Mechanic': 'bg-orange-100 text-orange-600',
    };
    return colors[name] || 'bg-gray-100 text-gray-600';
  };

  const getGreeting = () => {
    if (!user?.name) return t('home.greeting');
    const firstName = user.name.split(' ')[0];
    return `${firstName}, কাজ লাগবে? 😄`;
  };

  const handleServiceSelect = (serviceId: string) => {
    router.push(`/search?service=${serviceId}`);
  };

  const handleProviderSelect = (providerId: string) => {
    router.push(`/booking/new?provider=${providerId}`);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-bg-main pb-2">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary px-4 pt-8 pb-16 rounded-b-3xl lg:rounded-3xl"
      >
        <div className="container-custom">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">{getGreeting()}</h1>
              <p className="text-white/80 text-sm mt-1">{t('home.subtitle')}</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:cursor-pointer">
              <MapPin className="w-5 h-5 text-white" /> 
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
            <Input
              type="text"
              placeholder={t('home.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
              className="h-12 pl-12 pr-4 rounded-xl border-0 shadow-lg bg-white"
            />
            {isSearching && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {isSearching ? (
        <div className="container-custom -mt-8 lg:mt-8">
          {filteredCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-3">সার্ভিস</h3>
              <div className="flex flex-wrap gap-2">
                {filteredCategories.map((service) => (
                  <Card
                    key={service.id}
                    className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
                    onClick={() => handleServiceSelect(service.id)}
                  >
                    <CardContent className="p-3 flex items-center gap-3">
                      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", service.color)}>
                        {service.id === 'electrician' && <Zap className="w-4 h-4" />}
                        {service.id === 'plumber' && <Droplets className="w-4 h-4" />}
                        {service.id === 'ac-repair' && <Wind className="w-4 h-4" />}
                        {service.id === 'cleaner' && <Sparkles className="w-4 h-4" />}
                        {service.id === 'tutor' && <GraduationCap className="w-4 h-4" />}
                        {service.id === 'mechanic' && <Wrench className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {locale === 'bn' ? service.nameBn : service.name}
                        </p>
                        <p className="text-xs text-text-muted">৳{service.price}+</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredProviders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-text-secondary mb-3">প্রোভাইডার</h3>
              <div className="flex flex-col gap-3">
                {filteredProviders.map((provider) => (
                  <Card
                    key={provider.id}
                    className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
                    onClick={() => handleProviderSelect(provider.id)}
                  >
                    <CardContent className="p-4 flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary-soft text-primary text-sm">
                          {provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary text-sm">{provider.name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-warning fill-warning" />
                            <span className="text-xs text-text-secondary">{provider.rating.toFixed(1)}</span>
                          </div>
                          <span className="text-xs text-text-muted">• {provider.area}</span>
                        </div>
                      </div>
                      <Badge
                        variant={provider.status === 'available' ? 'success' : provider.status === 'busy' ? 'warning' : 'secondary'}
                        className="text-xs"
                      >
                        {provider.status === 'available' ? t('provider.online') : provider.status === 'busy' ? t('provider.busy') : t('provider.offline')}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filteredCategories.length === 0 && filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <Search className="w-10 h-10 text-text-muted mx-auto mb-3" />
              <p className="text-text-muted">&ldquo;{searchQuery}&rdquo; এর জন্য কিছু পাওয়া যায়নি</p>
              <button
                onClick={handleSearchSubmit}
                className="mt-3 text-sm text-primary font-medium"
              >
                সব ফলাফল দেখুন
              </button>
            </div>
          )}

          {(filteredCategories.length > 0 || filteredProviders.length > 0) && (
            <button
              onClick={handleSearchSubmit}
              className="w-full py-3 text-center text-sm text-primary font-medium border border-primary/20 rounded-lg hover:bg-primary/5 transition-colors"
            >
              &ldquo;{searchQuery}&rdquo; এর জন্য সব ফলাফল দেখুন
            </button>
          )}
        </div>
      ) : (
        <>
        <div className="container-custom -mt-8 lg:mt-8">
        <div className="grid grid-cols-3 gap-3 lg:grid-cols-3">
          {categories.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-md transition-shadow border-0 rounded-lg" 
                onClick={() => handleServiceSelect(service.id)}
              >
                <CardContent className="p-3 lg:p-4 flex flex-col items-center gap-2">
                  <div className={cn("w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center", service.color)}>
                    {service.id === 'electrician' && <Zap className="w-5 h-5 lg:w-6 lg:h-6" />}
                    {service.id === 'plumber' && <Droplets className="w-5 h-5 lg:w-6 lg:h-6" />}
                    {service.id === 'ac-repair' && <Wind className="w-5 h-5 lg:w-6 lg:h-6" />}
                    {service.id === 'cleaner' && <Sparkles className="w-5 h-5 lg:w-6 lg:h-6" />}
                    {service.id === 'tutor' && <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6" />}
                    {service.id === 'mechanic' && <Wrench className="w-5 h-5 lg:w-6 lg:h-6" />}
                  </div>
                  <span className="text-xs font-medium text-text-primary text-center">
                    {locale === 'bn' ? service.nameBn : service.name}
                  </span>
                  <span className="text-xs text-text-muted">
                    ৳{service.price}+
                  </span>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container-custom mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">
            {t('home.nearbyProviders')}
          </h2>
          <button className="text-sm text-primary font-medium">
            {t('common.seeAll')}
          </button>
        </div>

        {isLoading ? (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-48 h-32 bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : providers.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-text-muted">আপনার আশেপাশে কোনো সার্ভিস প্রোভাইডার নেই</p>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-shrink-0 lg:flex-shrink"
              >
                <Card 
                  className="w-42 lg:w-full cursor-pointer hover:shadow-md transition-shadow rounded-lg"
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary-soft text-primary text-sm">
                          {provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-text-primary truncate text-sm">
                          {provider.name}
                        </p>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-warning fill-warning" />
                          <span className="text-xs text-text-secondary">{provider.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant={provider.status === 'available' ? 'success' : provider.status === 'busy' ? 'warning' : 'secondary'}
                        className="text-xs"
                      >
                        {provider.status === 'available' ? t('provider.online') : provider.status === 'busy' ? t('provider.busy') : t('provider.offline')}
                      </Badge>
                      <span className="text-sm font-medium text-primary">
                        ৳{provider.price}+
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="container-custom mt-6 pb-4">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          {t('home.popularServices')}
        </h2>
        
        {categories.slice(0, 4).map((service) => (
          <Card 
            key={service.id}
            className="mb-3 cursor-pointer hover:shadow-md transition-shadow rounded-lg"
            onClick={() => handleServiceSelect(service.id)}
          >
            <CardContent className="p-4 flex items-center gap-4">
              <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", service.color)}>
                {service.id === 'electrician' && <Zap className="w-7 h-7" />}
                {service.id === 'plumber' && <Droplets className="w-7 h-7" />}
                {service.id === 'ac-repair' && <Wind className="w-7 h-7" />}
                {service.id === 'cleaner' && <Sparkles className="w-7 h-7" />}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text-primary">
                  {locale === 'bn' ? service.nameBn : service.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {t('services.basePrice')}: ৳{service.price}
                </p>
              </div>
              <Button size="sm" variant="secondary">
                {locale === 'bn' ? 'বুক করুন' : 'Book'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
        </>
      )}
    </div>
  );
}