import { API_BASE_URL } from '@/lib/constants';
import https from 'https';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const params = new URLSearchParams();

    if (query) params.set('s', query);

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const response = await fetch(`${API_BASE_URL}/topics?${params}`, { agent });

    if (!response.ok) {
      return new NextResponse('Failed to fetch topics', {
        status: response.status
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.log({ error });
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
