import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickUpLocation = searchParams.get('pickUpLocation');
    const dropOffLocation = searchParams.get('dropOffLocation');
    const pickUpDate = searchParams.get('pickUpDate');
    const dropOffDate = searchParams.get('dropOffDate');
    const fleetTypeCode = searchParams.get('fleetTypeCode');
    const days = searchParams.get('days');
    const campaignCode = searchParams.get('campaignCode');

    if (!pickUpLocation || !dropOffLocation || !pickUpDate || !dropOffDate || !fleetTypeCode || !days) {
      return NextResponse.json({ error: 'Missing required parameters for alternate-dates-search' }, { status: 400 });
    }

    let apiUrl = `${JUCY_BASE_URL}/api/v3/trip/alternate-dates-search?accountKey=${JUCY_API_KEY}&pickUpLocation=${pickUpLocation}&dropOffLocation=${dropOffLocation}&pickUpDate=${pickUpDate}&dropOffDate=${dropOffDate}&fleetTypeCode=${fleetTypeCode}&days=${days}`;

    if (campaignCode) apiUrl += `&campaignCode=${campaignCode}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch alternate dates search from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/trip/alternate-dates-search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
