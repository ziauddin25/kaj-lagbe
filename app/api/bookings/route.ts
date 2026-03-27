import { NextRequest, NextResponse } from 'next/server';

const MOCK_MODE = true;

interface Booking {
  id: string;
  userId: string;
  providerId: string | null;
  categoryId: string;
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
  updatedAt: string;
  userName?: string;
  providerName?: string;
}

const mockBookings: Booking[] = [];

function generateId() {
  return 'booking_' + Date.now() + Math.random().toString(36).substr(2, 9);
}

function getCategoryName(categoryId: string): { name: string; nameBn: string } {
  const categories: Record<string, { name: string; nameBn: string }> = {
    'electrician': { name: 'Electrician', nameBn: 'ইলেকট্রিশিয়ান' },
    'plumber': { name: 'Plumber', nameBn: 'প্লাম্বার' },
    'ac-repair': { name: 'AC Repair', nameBn: 'এসি মেরামত' },
    'cleaner': { name: 'Cleaner', nameBn: 'ক্লিনার' },
    'tutor': { name: 'Tutor', nameBn: 'টিউটর' },
    'mechanic': { name: 'Mechanic', nameBn: 'মেকানিক' },
  };
  return categories[categoryId] || { name: 'Service', nameBn: 'সার্ভিস' };
}

function getProviderName(providerId: string | null): string | undefined {
  if (!providerId) return undefined;
  const providers: Record<string, string> = {
    'provider_1': 'রহিম ভাই',
    'provider_2': 'করিম স্যার',
    'provider_3': 'জামাল ভাই',
  };
  return providers[providerId];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, providerId, categoryId, description, address, phone, area, estimatedPrice } = body;

    if (!userId || !categoryId || !address || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const category = getCategoryName(categoryId);

    const booking: Booking = {
      id: generateId(),
      userId,
      providerId: providerId || null,
      categoryId,
      categoryName: category.name,
      categoryNameBn: category.nameBn,
      status: 'PENDING',
      description: description || '',
      address,
      phone,
      area: area || '',
      estimatedPrice: estimatedPrice || 300,
      finalPrice: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockBookings.push(booking);

    console.log('📝 Booking created:', booking);

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const providerId = searchParams.get('providerId');
  const status = searchParams.get('status');

  let bookings = [...mockBookings];

  if (userId) {
    bookings = bookings.filter(b => b.userId === userId);
  }

  if (providerId) {
    bookings = bookings.filter(b => b.providerId === providerId);
  }

  if (status) {
    bookings = bookings.filter(b => b.status === status);
  }

  bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const bookingsWithNames = bookings.map(b => ({
    ...b,
    providerName: getProviderName(b.providerId),
  }));

  return NextResponse.json(bookingsWithNames);
}