import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function DELETE(request: NextRequest, context: { params: Promise<{ reservationRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef } = params;
    const { searchParams } = new URL(request.url);
    const onlineLogin = searchParams.get('onlineLogin');

    let apiUrl = `${JUCY_BASE_URL}/api/v3/quotes/${reservationRef}?accountKey=${JUCY_API_KEY}`;

    if (onlineLogin) apiUrl += `&onlineLogin=${onlineLogin}`;

    const response = await fetch(apiUrl, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to cancel quote from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/quotes/{reservationRef} (DELETE):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
