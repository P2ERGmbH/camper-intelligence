import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest, context: { params: Promise<{ reservationRef: string, bookingRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef, bookingRef } = params;
    const apiUrl = `${JUCY_BASE_URL}/api/v3/ferry/${reservationRef}/quote/${bookingRef}?accountKey=${JUCY_API_KEY}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch ferry booking quote from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/ferry/{reservationRef}/quote/{bookingRef} (GET):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: Promise<{ reservationRef: string, bookingRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef, bookingRef } = params;
    const requestBody = await request.json();

    const apiUrl = `${JUCY_BASE_URL}/api/v3/ferry/${reservationRef}/quote/${bookingRef}?accountKey=${JUCY_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to update ferry booking quote from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/ferry/{reservationRef}/quote/{bookingRef} (PUT):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
