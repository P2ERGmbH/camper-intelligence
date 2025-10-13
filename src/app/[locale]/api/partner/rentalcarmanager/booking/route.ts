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
    const category_type_id = searchParams.get('category_type_id');
    const pickup_location_id = searchParams.get('pickup_location_id');
    const pickup_location_date = searchParams.get('pickup_location_date');
    const pickup_location_time = searchParams.get('pickup_location_time');
    const dropoff_location_id = searchParams.get('dropoff_location_id');
    const dropoff_location_date = searchParams.get('dropoff_location_date');
    const dropoff_location_time = searchParams.get('dropoff_location_time');
    const age_id = searchParams.get('age_id');
    const car_category_id = searchParams.get('car_category_id');
    const booking_type = searchParams.get('booking_type');
    const insurance_id = searchParams.get('insurance_id');
    const extra_kms_id = searchParams.get('extra_kms_id');
    const transmission = searchParams.get('transmission');
    const sendemail = searchParams.get('sendemail');
    const data = searchParams.get('data'); // Base64 encoded string

    if (!category_type_id || !pickup_location_id || !pickup_location_date || !pickup_location_time || !dropoff_location_id || !dropoff_location_date || !dropoff_location_time || !age_id || !car_category_id || !booking_type || !insurance_id || !extra_kms_id || !transmission || !data) {
      return NextResponse.json({ error: 'Missing required parameters for booking' }, { status: 400 });
    }

    let apiUrl = `${RCM_BASE_URL}/${RCM_API_KEY}/booking/${category_type_id}/${pickup_location_id}/${pickup_location_date}/${pickup_location_time}/${dropoff_location_id}/${dropoff_location_date}/${dropoff_location_time}/${age_id}/${car_category_id}/${booking_type}/${insurance_id}/${extra_kms_id}/${transmission}`;

    if (sendemail) {
      apiUrl += `/${sendemail}`;
    } else {
      apiUrl += `/-`; // Default for optional sendemail
    }

    apiUrl += `/?data=${data}`;

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
    console.error('Error in RCM API booking:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
