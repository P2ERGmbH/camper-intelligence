import {NextRequest, NextResponse} from 'next/server';
import * as cheerio from 'cheerio';
import {GoogleGenerativeAI} from '@google/generative-ai';

// Very basic Gemini API call - in a real app, this would be more robust
async function extractWithGemini(text: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL|| 'gemini-2.5-flash' });

    const prompt = `
      Analyze the following text from a company's website and extract the information for the fields listed below. Provide the output in a clean JSON format.

      **Instructions:**
      - **email:** Find the primary email address for the specific station, not a generic company-wide email. Will be most likely found in an href prefixed by "mailto:".
      - **opening_hours:** Extract the full opening hours text, including details about seasonality (e.g., "Ganzjährig"), days of the week, times, and any special notes about appointments or closures (e.g., "Samstags nach Vereinbarung", "Rosenmontag... geschlossen").

      **JSON Output Structure:**
      {
        "name": "string",
        "address": "string",
        "phone_number": "string",
        "email": "string",
        "opening_hours": "string",
        "payment_options": "string",
        "distance_motorway_km": "number",
        "distance_airport_km": "number",
        "distance_train_station_km": "number",
        "distance_bus_stop_km": "number",
        "parking_info": "string",
        "shopping_info": "string",
        "fuel_station_info": "string",
        "guest_toilet": "boolean",
        "lounge_area": "boolean",
        "greywater_disposal_info": "string"
      }

      **Website Text:**
      "${text}"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonString = response.text().replace(/```json/g, '').replace(/```/g, '');
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error with Gemini extraction:', error);
    return {};
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch the URL' }, { status: 500 });
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    let stationData: any = {};

    // 1. Initial scrape for basic info (fast, but might be generic)
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const json = JSON.parse($(el).html() || '');
        if (json['@type'] && (json['@type'].includes('Business') || json['@type'].includes('Organization'))) {
          stationData.station_name = stationData.station_name || json.name;
          if (json.address) {
            stationData.address = `${json.address.streetAddress}, ${json.address.postalCode} ${json.address.addressLocality}`;
          }
          stationData.phone_number = stationData.phone_number || json.telephone;
          stationData.station_email = stationData.station_email || json.email;
        }
      } catch (e) { /* Ignore parsing errors */ }
    });

    // Generic fallbacks
    if (!stationData.station_name) {
      stationData.station_name = $('h1').first().text().trim();
    }
    if (!stationData.address) {
        $('[class*="address"]').first().each((i, el) => {
            stationData.address = $(el).text().trim().replace(/\s\s+/g, ' ');
        });
    }
    if (!stationData.phone_number) {
        $('a[href^="tel:"]').first().each((i, el) => {
            stationData.phone_number = $(el).attr('href')?.replace('tel:', '');
        });
    }
    if (!stationData.station_email) {
        $('a[href^="mailto:"]').first().each((i, el) => {
            stationData.station_email = $(el).attr('href')?.replace('mailto:', '');
        });
    }

    // 2. AI-powered extraction for all fields
    const pageText = $('body').text().replace(/\s\s+/g, ' ');
    const geminiData = await extractWithGemini(pageText);

    // Filter out empty strings from Gemini data to avoid overwriting scraped data with nothing
    Object.keys(geminiData).forEach(key => {
      if (geminiData[key] === "") {
        delete geminiData[key];
      }
    });

    // 3. Merge the data, prioritizing AI results for non-empty values
    stationData = { ...stationData, ...geminiData };


    return NextResponse.json(stationData, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 });
  }
}
