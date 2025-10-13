import { NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: Request, { params }: { params: { reservationRef: string } }) {
  try {
    const { reservationRef } = params;
    const apiUrl = `${JUCY_BASE_URL}/api/v3/quotes/${reservationRef}/convert?accountKey=${JUCY_API_KEY}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to convert quote from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/quotes/{reservationRef}/convert:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
