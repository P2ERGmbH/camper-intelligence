import { getTranslations } from 'next-intl/server';
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {Station} from "@/types/station";

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
  const t = await getTranslations('errors');
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: t('url_required') }, { status: 400 });
    }

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: t('failed_to_fetch_url') }, { status: 500 });
    }
    const html = await response.text();
    const $ = cheerio.load(html);

    let stationData: Partial<Station> = {};

    // 1. Attempt to extract structured data (JSON-LD)
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const json = JSON.parse($(el).html() || '');
        if (json['@type'] && (json['@type'].includes('Business') || json['@type'].includes('Organization'))) {
          stationData.name = stationData.name || json.name;
          if (json.address) {
            stationData.address = `${json.address.streetAddress}, ${json.address.postalCode} ${json.address.addressLocality}`;
          }
          stationData.phone_number = stationData.phone_number || json.telephone;
          stationData.email = stationData.email || json.email;
          stationData.opening_hours = stationData.opening_hours || json.openingHoursSpecification;
        }
      } catch { /* Ignore parsing errors */ }
    });

    // Specific selectors for drm.de
    if (!stationData.name) {
      stationData.name = $('.station-detail__title h1').text().trim();
    }
    if (!stationData.address) {
      stationData.address = $('.station-detail__address').text().trim().replace(/\s\s+/g, ' ');
    }
    if (!stationData.phone_number) {
        stationData.phone_number = $('.station-detail__phone a').attr('href')?.replace('tel:', '');
    }
    if (!stationData.email) {
        stationData.email = $('.station-detail__email a').attr('href')?.replace('mailto:', '');
    }

    // Generic fallbacks
    if (!stationData.name) {
      stationData.name = $('h1').first().text().trim();
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
    if (!stationData.email) {
        $('a[href^="mailto:"]').first().each((i, el) => {
            stationData.email = $(el).attr('href')?.replace('mailto:', '');
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
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  }
}
