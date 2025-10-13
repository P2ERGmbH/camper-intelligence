import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest, { params }: { params: { fleetCategoryCode: string } }) {
  try {
    const { fleetCategoryCode } = params;
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');

    let apiUrl = `${JUCY_BASE_URL}/api/v3/fleet-categories/${fleetCategoryCode}?accountKey=${JUCY_API_KEY}`;

    if (countryCode) apiUrl += `&countryCode=${countryCode}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch data from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/fleet-categories/{fleetCategoryCode}:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
