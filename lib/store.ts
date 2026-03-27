import { create } from 'zustand';

export type UserRole = 'USER' | 'PROVIDER' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ProviderStatus = 'AVAILABLE' | 'BUSY' | 'OFFLINE';

interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
}

interface Provider {
  id: string;
  userId: string;
  bio?: string;
  skills: string[];
  basePrice: number;
  status: ProviderStatus;
  isApproved: boolean;
  latitude?: number;
  longitude?: number;
  address?: string;
  area?: string;
  totalJobs: number;
  rating?: number;
  user?: User;
}

interface Category {
  id: string;
  name: string;
  nameBn: string;
  icon: string;
  basePrice: number;
  estimatedTime: number;
  description?: string;
  descriptionBn?: string;
}

interface Booking {
  id: string;
  status: BookingStatus;
  description?: string;
  address: string;
  estimatedPrice: number;
  finalPrice?: number;
  createdAt: string;
  category?: Category;
  provider?: Provider;
  user?: User;
}

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  locale: 'bn' | 'en';
  categories: Category[];
  nearbyProviders: Provider[];
  bookings: Booking[];
  selectedCategory: Category | null;
  selectedProvider: Provider | null;
  currentBooking: Booking | null;
  
  setUser: (user: User | null) => void;
  setLocale: (locale: 'bn' | 'en') => void;
  setCategories: (categories: Category[]) => void;
  setNearbyProviders: (providers: Provider[]) => void;
  setBookings: (bookings: Booking[]) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSelectedProvider: (provider: Provider | null) => void;
  setCurrentBooking: (booking: Booking | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthenticated: false,
  locale: 'bn',
  categories: [],
  nearbyProviders: [],
  bookings: [],
  selectedCategory: null,
  selectedProvider: null,
  currentBooking: null,

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setLocale: (locale) => set({ locale }),
  setCategories: (categories) => set({ categories }),
  setNearbyProviders: (nearbyProviders) => set({ nearbyProviders }),
  setBookings: (bookings) => set({ bookings }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSelectedProvider: (selectedProvider) => set({ selectedProvider }),
  setCurrentBooking: (currentBooking) => set({ currentBooking }),
}));