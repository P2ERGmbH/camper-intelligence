import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickUpSiteCode = searchParams.get('pickUpSiteCode');
    const dropOffSiteCode = searchParams.get('dropOffSiteCode');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    if (!pickUpSiteCode || !dropOffSiteCode || !startDate || !endDate) {
      return NextResponse.json({ error: 'Missing required parameters for hire periods' }, { status: 400 });
    }

    const apiUrl = `${JUCY_BASE_URL}/api/hire-periods?accountKey=${JUCY_API_KEY}&pickUpSiteCode=${pickUpSiteCode}&dropOffSiteCode=${dropOffSiteCode}&startDate=${startDate}&endDate=${endDate}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch data from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API hire-periods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
