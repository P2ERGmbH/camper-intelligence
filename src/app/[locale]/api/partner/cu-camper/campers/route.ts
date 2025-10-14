import { NextResponse } from 'next/server';

const CU_CAMPER_API_KEY = process.env.CU_CAMPER_API_KEY;
const CU_CAMPER_BASE_URL = 'https://www.cu-camper.com/api/api.php';

export async function GET() {
  try {
    if (!CU_CAMPER_API_KEY) {
      return NextResponse.json({ error: 'CU_CAMPER_API_KEY is not defined' }, { status: 500 });
    }

    const apiUrl = `${CU_CAMPER_BASE_URL}?run=VehiclesApi&language=de&affiliate=cuweb&apikey=${CU_CAMPER_API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`CU Camper API Error (Vehicles): ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch campers from CU Camper API', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in CU Camper partner API (campers):', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
