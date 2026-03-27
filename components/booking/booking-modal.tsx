"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Phone, FileText, Clock, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { useI18n } from "@/lib/i18n";

interface Provider {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  jobs: number;
  area: string;
  status: string;
  price: number;
  phone?: string;
}

interface Category {
  id: string;
  name: string;
  nameBn: string;
  price: number;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: Provider | null;
  category: Category | null;
}

export function BookingModal({ isOpen, onClose, provider, category }: BookingModalProps) {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone);
    }
  }, [user]);

  useEffect(() => {
    if (!isOpen) {
      setDescription("");
      setAddress("");
      setScheduledTime("");
      setSuccess(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim() || !phone.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      const bookingData = {
        userId: user?.id || 'guest',
        providerId: provider?.id || null,
        categoryId: category?.id || 'electrician',
        description,
        address,
        phone,
        area: provider?.area || 'Dhaka',
        estimatedPrice: provider?.price || category?.price || 300,
      };

      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Booking failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white w-full max-w-lg rounded-t-3xl lg:rounded-3xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between rounded-t-3xl">
            <h2 className="text-lg font-bold text-text-primary">
              {success ? 'সফল!' : locale === 'bn' ? 'বুকিং করুন' : 'Book Service'}
            </h2>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
            >
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>

          {success ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 text-center"
            >
              <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-success" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                লোককে জানানো হয়েছে 😎
              </h3>
              <p className="text-text-secondary">
                {locale === 'bn' 
                  ? 'আমাদের টিম শীঘ্রই যোগাযোগ করবে' 
                  : 'Our team will contact you soon'}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="p-4">
              {provider && (
                <Card className="mb-4 border-primary/20 bg-primary-soft">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{provider.name}</p>
                        <p className="text-sm text-text-secondary">
                          {locale === 'bn' ? category?.nameBn : category?.name} • ৳{provider.price}+
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <FileText className="w-4 h-4 inline mr-1" />
                    {locale === 'bn' ? 'সমস্যার বিবরণ (অপশনাল)' : 'Problem Description (Optional)'}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={locale === 'bn' 
                      ? 'কি সমস্যা বলুন...' 
                      : 'Describe your problem...'}
                    className="w-full h-24 p-3 rounded-xl border border-gray-200 text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    {locale === 'bn' ? 'ঠিকানা *' : 'Address *'}
                  </label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder={locale === 'bn' 
                      ? 'বাড়ি নং, রোড, এলাকা...' 
                      : 'House No, Road, Area...'}
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    {locale === 'bn' ? 'ফোন নম্বর *' : 'Phone Number *'}
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                    placeholder="০১XXXXXXXXX"
                    required
                    className="h-12"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    {locale === 'bn' ? 'সময় (অপশনাল)' : 'Schedule Time (Optional)'}
                  </label>
                  <Input
                    type="datetime-local"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="bg-primary-soft rounded-xl p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">
                      {locale === 'bn' ? 'আনুমানিক খরচ' : 'Estimated Cost'}
                    </span>
                    <span className="text-2xl font-bold text-primary">
                      ৳{provider?.price || category?.price || 300}+
                    </span>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-14 text-lg"
                  disabled={isLoading || !address.trim() || !phone.trim()}
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      {locale === 'bn' ? 'বুকিং নিশ্চিত করুন' : 'Confirm Booking'}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}