import { NextResponse } from 'next/server';
import { performSearch } from '@/lib/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json({ message: 'Query parameter is missing' }, { status: 400 });
  }

  try {
    const results = await performSearch(query);
    return NextResponse.json(results);
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

