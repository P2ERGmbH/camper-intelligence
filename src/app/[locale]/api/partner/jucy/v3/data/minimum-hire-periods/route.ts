import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickUpLocationCode = searchParams.get('pickUpLocationCode');
    const dropOffLocationCode = searchParams.get('dropOffLocationCode');
    const fleetCategoryCode = searchParams.get('fleetCategoryCode');
    const fleetTypeCode = searchParams.get('fleetTypeCode');
    const region = searchParams.get('region');
    const format = searchParams.get('format');

    let apiUrl = `${JUCY_BASE_URL}/api/v3/data/minimum-hire-periods?accountKey=${JUCY_API_KEY}`;

    if (pickUpLocationCode) apiUrl += `&pickUpLocationCode=${pickUpLocationCode}`;
    if (dropOffLocationCode) apiUrl += `&dropOffLocationCode=${dropOffLocationCode}`;
    if (fleetCategoryCode) apiUrl += `&fleetCategoryCode=${fleetCategoryCode}`;
    if (fleetTypeCode) apiUrl += `&fleetTypeCode=${fleetTypeCode}`;
    if (region) apiUrl += `&region=${region}`;
    if (format) apiUrl += `&format=${format}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch data from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/data/minimum-hire-periods:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
