import { API_BASE_URL } from '@/lib/constants';
import https from 'https';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = new URLSearchParams();

    // Map the parameters to match the main API's expected format
    if (searchParams.get('type')) params.set('type', searchParams.get('type')!);
    if (searchParams.get('topic'))
      params.set('topic', searchParams.get('topic')!);
    if (searchParams.get('authorId'))
      params.set('author', searchParams.get('authorId')!);
    if (searchParams.get('q')) params.set('s', searchParams.get('q')!);
    if (searchParams.get('sort'))
      params.set('orderby', searchParams.get('sort')!);
    if (searchParams.get('limit'))
      params.set('per_page', searchParams.get('limit')!);

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const response = await fetch(`${API_BASE_URL}/resources?${params}`, {
      agent
    });

    if (!response.ok) {
      return new NextResponse('Failed to fetch resources', {
        status: response.status
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
