import { NextRequest, NextResponse } from 'next/server';
import { JucyRentalCatalogResponse } from '@/types/jucy';

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function getJucyRentalCatalog({fleetCategory, fleetType }: {fleetCategory?:string, fleetType?:string} ): Promise<JucyRentalCatalogResponse> {
  let apiUrl = `${JUCY_BASE_URL}/api/v3/rental-catalog?accountKey=${JUCY_API_KEY}`;

  if (fleetCategory) apiUrl += `&fleetCategory=${fleetCategory}`;
  if (fleetType) apiUrl += `&fleetType=${fleetType}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Jucy API Error: ${response.status} - ${errorText}`);
    return {error:errorText, status: response.status, products: [] };
  }

  const data: JucyRentalCatalogResponse = await response.json();
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fleetCategory = searchParams.get('fleetCategory') || '';
    const fleetType = searchParams.get('fleetType') || '';

   const response = await getJucyRentalCatalog({fleetCategory, fleetType})

    if (response.error) {
      return NextResponse.json({ error: 'Failed to fetch rental catalog from Jucy API', details: response.error }, { status: response.status });
    }
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in Jucy API v3/rental-catalog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
