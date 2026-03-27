import { NextRequest, NextResponse } from 'next/server';

const mockBookings: any[] = [];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, providerId, finalPrice } = body;

    const bookingIndex = mockBookings.findIndex(b => b.id === id);

    if (bookingIndex === -1) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking = mockBookings[bookingIndex];
    booking.status = status || booking.status;
    booking.updatedAt = new Date().toISOString();

    if (providerId) {
      booking.providerId = providerId;
    }

    if (finalPrice) {
      booking.finalPrice = finalPrice;
    }

    if (status === 'IN_PROGRESS') {
      booking.startTime = new Date().toISOString();
    }

    if (status === 'COMPLETED') {
      booking.endTime = new Date().toISOString();
    }

    console.log(`📝 Booking ${id} status updated to: ${status}`);

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const booking = mockBookings.find(b => b.id === id);

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Get booking error:', error);
    return NextResponse.json(
      { error: 'Failed to get booking' },
      { status: 500 }
    );
  }
}