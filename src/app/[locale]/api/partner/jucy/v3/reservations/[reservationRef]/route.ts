import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest, context: { params: Promise<{ reservationRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef } = params;
    const apiUrl = `${JUCY_BASE_URL}/api/v3/reservations/${reservationRef}?accountKey=${JUCY_API_KEY}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch booking from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/reservations/{reservationRef} (GET):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ reservationRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef } = params;
    const { searchParams } = new URL(request.url);
    const onlineLogin = searchParams.get('onlineLogin');

    let apiUrl = `${JUCY_BASE_URL}/api/v3/reservations/${reservationRef}?accountKey=${JUCY_API_KEY}`;

    if (onlineLogin) apiUrl += `&onlineLogin=${onlineLogin}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to cancel reservation from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/reservations/{reservationRef} (DELETE):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ reservationRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef } = params;
    const requestBody = await request.json();

    const apiUrl = `${JUCY_BASE_URL}/api/v3/reservations/${reservationRef}?accountKey=${JUCY_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to update reservation from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/reservations/{reservationRef} (PATCH):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
