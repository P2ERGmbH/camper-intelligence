import { NextRequest, NextResponse } from 'next/server';
import { JucySitesResponse } from '@/types/jucy';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function getJucySites({countryCode, businessUnitCode }: {countryCode?:string, businessUnitCode?:string} ): Promise<JucySitesResponse>{
  let apiUrl = `${JUCY_BASE_URL}/api/v3/sites?accountKey=${JUCY_API_KEY}`;

  if (countryCode) apiUrl += `&countryCode=${countryCode}`;
  if (businessUnitCode) apiUrl += `&businessUnitCode=${businessUnitCode}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Jucy API Error: ${response.status} - ${errorText}`);
    return { error: errorText, status: response.status, sites:[] };
  }

  const data: JucySitesResponse = {
    sites: await response.json()
  };
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const countryCode = searchParams.get('countryCode') || '';
    const businessUnitCode = searchParams.get('businessUnitCode') || '';

    let apiUrl = `${JUCY_BASE_URL}/api/v3/sites?accountKey=${JUCY_API_KEY}`;

    if (countryCode) apiUrl += `&countryCode=${countryCode}`;
    if (businessUnitCode) apiUrl += `&businessUnitCode=${businessUnitCode}`;

    const response = await getJucySites({countryCode: countryCode, businessUnitCode: businessUnitCode});

    if (response.error) {
      console.error(`Jucy API Error: ${response.status} - ${response.error}`);
      return NextResponse.json({ error: 'Failed to fetch sites from Jucy API', details: response.error }, { status: response.status });
    }

    return NextResponse.json(response.sites);
  } catch (error) {
    console.error('Error in Jucy API v3/sites:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
