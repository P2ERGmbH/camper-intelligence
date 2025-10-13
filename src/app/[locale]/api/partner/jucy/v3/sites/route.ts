import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode');
    const businessUnitCode = searchParams.get('businessUnitCode');

    let apiUrl = `${JUCY_BASE_URL}/api/v3/sites?accountKey=${JUCY_API_KEY}`;

    if (countryCode) apiUrl += `&countryCode=${countryCode}`;
    if (businessUnitCode) apiUrl += `&businessUnitCode=${businessUnitCode}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch sites from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/sites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
