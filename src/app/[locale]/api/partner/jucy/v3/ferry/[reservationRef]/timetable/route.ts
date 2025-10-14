import { NextRequest, NextResponse } from 'next/server';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function GET(request: NextRequest, context: { params: Promise<{ reservationRef: string }> }) {
  try {
    const params = await context.params;
    const { reservationRef } = params;
    const { searchParams } = new URL(request.url);
    const departPort = searchParams.get('departPort');
    const destinationPort = searchParams.get('destinationPort');
    const fromSailingDate = searchParams.get('fromSailingDate');
    const toSailingDate = searchParams.get('toSailingDate');

    if (!departPort || !destinationPort || !fromSailingDate || !toSailingDate) {
      return NextResponse.json({ error: 'Missing required parameters for ferry timetable' }, { status: 400 });
    }

    const apiUrl = `${JUCY_BASE_URL}/api/v3/ferry/${reservationRef}/timetable?accountKey=${JUCY_API_KEY}&departPort=${departPort}&destinationPort=${destinationPort}&fromSailingDate=${fromSailingDate}&toSailingDate=${toSailingDate}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Jucy API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch ferry timetable from Jucy API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in Jucy API v3/ferry/{reservationRef}/timetable:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
