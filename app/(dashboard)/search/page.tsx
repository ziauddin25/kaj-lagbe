"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useI18n } from "@/lib/i18n";
import { BookingModal } from "@/components/booking/booking-modal";
import { cn } from "@/lib/utils";

const serviceCategories = [
  { id: "electrician", name: "Electrician", nameBn: "ইলেকট্রিশিয়ান", icon: "⚡", price: 300 },
  { id: "plumber", name: "Plumber", nameBn: "প্লাম্বার", icon: "💧", price: 250 },
  { id: "ac-repair", name: "AC Repair", nameBn: "এসি মেরামত", icon: "❄️", price: 500 },
  { id: "cleaner", name: "Cleaner", nameBn: "ক্লিনার", icon: "✨", price: 200 },
  { id: "tutor", name: "Tutor", nameBn: "টিউটর", icon: "📚", price: 400 },
  { id: "mechanic", name: "Mechanic", nameBn: "মেকানিক", icon: "🔧", price: 350 },
];

const mockProviders = [
  { id: "provider_1", name: "রহিম ভাই", avatar: "", rating: 4.8, jobs: 156, area: "মিরপুর", status: "available", price: 350, phone: "01712345678", skills: ["ইলেকট্রিক", "ওয়ারিং"] },
  { id: "provider_2", name: "করিম স্যার", avatar: "", rating: 4.9, jobs: 243, area: "ধানমন্ডি", status: "available", price: 400, phone: "01812345678", skills: ["এসি", "ফ্রিজ"] },
  { id: "provider_3", name: "জামাল ভাই", avatar: "", rating: 4.7, jobs: 89, area: "গুলশান", status: "busy", price: 320, phone: "01912345678", skills: ["প্লাম্বিং", "পাইপ"] },
  { id: "provider_4", name: "সুবেদ ভাই", avatar: "", rating: 4.6, jobs: 67, area: "উত্তরা", status: "available", price: 280, phone: "01612345678", skills: ["ক্লিনিং", "ওয়াশিং"] },
];

export default function SearchScreen() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("service") || "");
  const [selectedService, setSelectedService] = useState(searchParams.get("service") || "");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<typeof mockProviders[0] | null>(null);

  const currentCategory = serviceCategories.find(c => c.id === selectedService) || null;

  const filteredProviders = mockProviders.filter(
    (p) => selectedService || p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleServiceSelect = (serviceId: string) => {
    setSelectedService(serviceId);
    router.push(`/search?service=${serviceId}`);
  };

  const handleBookClick = (provider: typeof mockProviders[0]) => {
    setSelectedProvider(provider);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg-main pb-20 lg:pb-8">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 bg-bg-main z-10 px-4 py-4"
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <Input
            type="text"
            placeholder={locale === 'bn' ? 'সার্ভিস খুঁজুন...' : 'Search services...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-11 pl-12 pr-12 rounded-xl border-gray-200"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1">
            <Filter className="w-5 h-5 text-text-muted" />
          </button>
        </div>

        <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide pb-1">
          <button
            onClick={() => { setSelectedService(""); router.push("/search"); }}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
              selectedService === "" 
                ? "bg-primary text-white" 
                : "bg-bg-soft text-text-secondary"
            )}
          >
            {locale === 'bn' ? 'সব সার্ভিস' : 'All Services'}
          </button>
          {serviceCategories.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                selectedService === service.id 
                  ? "bg-primary text-white" 
                  : "bg-bg-soft text-text-secondary"
              )}
            >
              {locale === 'bn' ? service.nameBn : service.name}
            </button>
          ))}
        </div>
      </motion.div>

      <div className="px-4 pb-4">
        {filteredProviders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-lg font-medium text-text-primary">
              {locale === 'bn' ? 'কোনো লোক পাওয়া যায়নি' : 'No providers found'}
            </p>
            <p className="text-sm text-text-secondary mt-2">
              {locale === 'bn' ? 'আপনার আশেপাশে খুঁজতেছি 😎' : 'Searching nearby...'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden rounded-lg">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-primary-soft text-primary text-lg">
                          {provider.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-text-primary">{provider.name}</h3>
                          <Badge 
                            variant={provider.status === 'available' ? 'success' : 'warning'}
                            className="text-xs"
                          >
                            {provider.status === 'available' 
                              ? (locale === 'bn' ? 'অনলাইন' : 'Online')
                              : (locale === 'bn' ? 'ব্যস্ত' : 'Busy')}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="text-sm font-medium text-text-primary">{provider.rating}</span>
                            <span className="text-xs text-text-muted">({provider.jobs})</span>
                          </div>
                          <div className="flex items-center gap-1 text-text-muted">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{provider.area}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {provider.skills.map((skill) => (
                            <span 
                              key={skill}
                              className="px-2 py-0.5 bg-bg-soft rounded-full text-xs text-text-secondary"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">৳{provider.price}</p>
                        <p className="text-xs text-text-muted">
                          {locale === 'bn' ? 'শুরু থেকে' : 'Starting'}
                        </p>
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      size="sm"
                      onClick={() => handleBookClick(provider)}
                      disabled={provider.status !== 'available'}
                    >
                      {locale === 'bn' ? 'বুক করুন' : 'Book Now'}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        provider={selectedProvider}
        category={currentCategory}
      />
    </div>
  );
}