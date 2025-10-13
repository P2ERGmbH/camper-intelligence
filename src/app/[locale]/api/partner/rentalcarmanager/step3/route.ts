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
    const details_flag = searchParams.get('details_flag');
    const campaign_code = searchParams.get('campaign_code');

    if (!category_type_id || !pickup_location_id || !pickup_location_date || !pickup_location_time || !dropoff_location_id || !dropoff_location_date || !dropoff_location_time || !age_id || !car_category_id || !details_flag) {
      return NextResponse.json({ error: 'Missing required parameters for step3' }, { status: 400 });
    }

    let apiUrl = `${RCM_BASE_URL}/${RCM_API_KEY}/step3/${category_type_id}/${pickup_location_id}/${pickup_location_date}/${pickup_location_time}/${dropoff_location_id}/${dropoff_location_date}/${dropoff_location_time}/${age_id}/${car_category_id}/${details_flag}`;

    if (campaign_code) {
      apiUrl += `/${campaign_code}`;
    } else {
      apiUrl += `/-`; // Default for optional campaign_code
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

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in RCM API step3:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
