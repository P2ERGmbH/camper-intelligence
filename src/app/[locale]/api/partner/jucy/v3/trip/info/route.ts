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
    const fleetCategory = searchParams.get('fleetCategory');
    const driverAge = searchParams.get('driverAge');
    const numberOfPeople = searchParams.get('numberOfPeople');
    const campaignCode = searchParams.get('campaignCode');

    if (!pickUpLocation || !dropOffLocation || !pickUpDate || !dropOffDate || !fleetCategory) {
      return NextResponse.json({ error: 'Missing required parameters for trip info' }, { status: 400 });
    }

    let apiUrl = `${JUCY_BASE_URL}/api/v3/trip/info?accountKey=${JUCY_API_KEY}&pickUpLocation=${pickUpLocation}&dropOffLocation=${dropOffLocation}&pickUpDate=${pickUpDate}&dropOffDate=${dropOffDate}&fleetCategory=${fleetCategory}`;

    if (driverAge) apiUrl += `&driverAge=${driverAge}`;
    if (numberOfPeople) apiUrl += `&numberOfPeople=${numberOfPeople}`;
    if (campaignCode) apiUrl += `&campaignCode=${campaignCode}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch trip info from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/trip/info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
