import { NextRequest, NextResponse } from 'next/server';

const FIPE_BASE_URL = 'https://fipe.parallelum.com.br/api/v2';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path') || '';
  
  if (!path) {
    return NextResponse.json({ error: 'Path parameter is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`${FIPE_BASE_URL}/${path}`, {
      headers: {
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`FIPE API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching from FIPE API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from FIPE API' },
      { status: 500 }
    );
  }
}
