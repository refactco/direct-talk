import { API_BASE_URL } from '@/lib/constants';
import https from 'https';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const pageNum = searchParams.get('page') ?? '1';
    const perPage = searchParams.get('per_page') ?? '10';

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const response = await fetch(
      `${API_BASE_URL}/resources/${params.id}/episodes?page=${pageNum}&per_page=${perPage}`,
      { agent }
    );

    if (!response.ok) {
      return new NextResponse('Failed to fetch resource episodes', {
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
