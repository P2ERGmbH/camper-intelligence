import { getTranslations } from 'next-intl/server';
import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function extractWithGemini(text: string) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL|| 'gemini-2.5-flash' });

    const prompt = `
      Analyze the following text from a camper rental website and extract the information for the fields listed below. Provide the output in a clean JSON format.

      **Instructions:**
      - **addons:** Look for a list of optional extras, accessories, or bookable items. Categorize them if possible (e.g., "Kitchen", "Comfort", "Outdoor"). The output should be an array of objects, where each object has a "name" and "category" property.
      - For boolean fields, use true or false. For numeric fields, use numbers only.

      **JSON Output Structure:**
      {
        "name": "string",
        "description": "string",
        "sleeps_adults": "number",
        "sleeps_children": "number",
        "max_adults": "number",
        "max_children": "number",
        "passengers_seats": "number",
        "passengers_seats_isofix": "number",
        "dimension_length_min": "number",
        "dimension_height_min": "number",
        "dimension_width_min": "number",
        "transmission_automatic": "boolean",
        "awning": "boolean",
        "air_condition_driving_cabin": "boolean",
        "air_condition_living_area": "boolean",
        "shower_wc": "number",
        "tank_freshwater": "number",
        "tank_wastewater1": "number",
        "fridge": "boolean",
        "navigation": "boolean",
        "consumption": "number",
        "four_wd": "boolean",
        "rear_cam": "boolean",
        "tv": "boolean",
        "addons": [
          { "name": "string", "category": "string", "description": "string", "price_per_unit": "number", "max_quantity": "number" }
        ]
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

    const pageText = $('body').text().replace(/\s\s+/g, ' ');
    const camperData = await extractWithGemini(pageText);

    return NextResponse.json(camperData, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: t('internal_server_error') }, { status: 500 });
  }
}
