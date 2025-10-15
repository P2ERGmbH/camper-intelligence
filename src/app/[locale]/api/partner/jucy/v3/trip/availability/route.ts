import { NextRequest, NextResponse } from 'next/server';
import {JucyTripAvailabilityResponse} from "@/types/jucy";

const JUCY_API_KEY = process.env.JUCY_API_KEY || 'YOUR_JUCY_API_KEY';
const JUCY_BASE_URL = 'https://lanier.test.jucy.cloud';

export async function getJucyTripAvailability(params: {
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  dropOffDate: string;
  fleetTypeCode: string;
  driverAge?: string;
  campaignCode?: string;
  mergeSurchargesFees?: string;
  reservationReference?: string;
}): Promise<JucyTripAvailabilityResponse> {
  const {
    pickUpLocation,
    dropOffLocation,
    pickUpDate,
    dropOffDate,
    fleetTypeCode,
    driverAge,
    campaignCode,
    mergeSurchargesFees,
    reservationReference,
  } = params;

  if (!pickUpLocation || !dropOffLocation || !pickUpDate || !dropOffDate || !fleetTypeCode) {
    return { error: 'Missing required parameters for availability', status: 400 };
  }

  let apiUrl = `${JUCY_BASE_URL}/api/v3/trip/availability?accountKey=${JUCY_API_KEY}&pickUpLocation=${pickUpLocation}&dropOffLocation=${dropOffLocation}&pickUpDate=${pickUpDate}&dropOffDate=${dropOffDate}&fleetTypeCode=${fleetTypeCode}`;

  if (driverAge) apiUrl += `&driverAge=${driverAge}`;
  if (campaignCode) apiUrl += `&campaignCode=${campaignCode}`;
  if (mergeSurchargesFees) apiUrl += `&mergeSurchargesFees=${mergeSurchargesFees}`;
  if (reservationReference) apiUrl += `&reservationReference=${reservationReference}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`Jucy API Error: ${response.status} - ${errorText}`);
    return { error: errorText , status: response.status };
  }

  const data: JucyTripAvailabilityResponse = {availability: await response.json()};
  return data;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pickUpLocation = searchParams.get('pickUpLocation') || '';
    const dropOffLocation = searchParams.get('dropOffLocation') || '';
    const pickUpDate = searchParams.get('pickUpDate') || '';
    const dropOffDate = searchParams.get('dropOffDate') || '';
    const fleetTypeCode = searchParams.get('fleetTypeCode') || '';
    const driverAge = searchParams.get('driverAge') || '';
    const campaignCode = searchParams.get('campaignCode') || '';
    const mergeSurchargesFees = searchParams.get('mergeSurchargesFees') || '';
    const reservationReference = searchParams.get('reservationReference') || '';

    if (!pickUpLocation || !dropOffLocation || !pickUpDate || !dropOffDate || !fleetTypeCode) {
      return NextResponse.json({ error: 'Missing required parameters for availability' }, { status: 400 });
    }

    const response = await getJucyTripAvailability({pickUpLocation, dropOffLocation, pickUpDate, dropOffDate, fleetTypeCode, driverAge, campaignCode, mergeSurchargesFees, reservationReference});

    if (response.error) {
      console.error(`Jucy API Error: ${response.status} - ${response.error}`);
      return NextResponse.json({ error: 'Failed to fetch availability from Jucy API', details: response.error }, { status: response.status });
    }

    return NextResponse.json(response.availability);
  } catch (error) {
    console.error('Error in Jucy API v3/trip/availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
