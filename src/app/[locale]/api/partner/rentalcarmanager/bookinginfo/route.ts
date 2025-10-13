import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const RCM_API_KEY = process.env.RCM_API_KEY || 'YOUR_RCM_API_KEY';
const RCM_HASH_SECRET = process.env.RCM_HASH_SECRET || 'YOUR_RCM_HASH_SECRET';
const RCM_BASE_URL = 'https://apis.rentalcarmanager.com/booking/v3.1';

// Function to generate HMACSHA256 signature
function generateSignature(method: string, url: string, secret: string): string {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(method.toUpperCase() + url);
  return hmac.digest('hex');
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rcm_reservation_reference = searchParams.get('rcm_reservation_reference');
    const rcm_reservation_number = searchParams.get('rcm_reservation_number');
    const data = searchParams.get('data'); // Base64 encoded customer data

    let apiUrl = '';

    if (rcm_reservation_reference) {
      apiUrl = `${RCM_BASE_URL}/${RCM_API_KEY}/bookinginfo/${rcm_reservation_reference}/-`;
    } else if (rcm_reservation_number && data) {
      apiUrl = `${RCM_BASE_URL}/${RCM_API_KEY}/bookinginfo/${rcm_reservation_number}/?data=${data}`;
    } else {
      return NextResponse.json({ error: 'Missing required parameters for bookinginfo' }, { status: 400 });
    }

    const signature = generateSignature('GET', apiUrl, RCM_HASH_SECRET);

    const response = await fetch(apiUrl, {
      headers: {
        'X-RCM-Signature': signature,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`RCM API Error: ${response.status} - ${errorText}`);
      return NextResponse.json({ error: 'Failed to fetch data from Rental Car Manager API', details: errorText }, { status: response.status });
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error in RCM API bookinginfo:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
