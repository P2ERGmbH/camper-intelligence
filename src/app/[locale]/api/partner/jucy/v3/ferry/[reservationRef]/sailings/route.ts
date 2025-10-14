import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function POST(request: NextRequest, context: { params: Promise<{ reservationRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef } = params;
    const requestBody = await request.json();

    const apiUrl = `${JUCY_BASE_URL}/api/v3/ferry/${reservationRef}/sailings?accountKey=${JUCY_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch ferry sailings from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/ferry/{reservationRef}/sailings (POST):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
