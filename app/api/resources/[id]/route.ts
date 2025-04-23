import { API_BASE_URL } from '@/lib/constants';
import https from 'https';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { mockAllEpisodes } from '../../mocked-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const useMock = process.env.MOCKED_DATA === 'true';

    if (useMock) {
      const data = mockAllEpisodes.find(
        (resource) => resource.ref_id === params.id
      );

      return NextResponse.json(data);
    }

    const agent = new https.Agent({
      rejectUnauthorized: false
    });

    const response = await fetch(`${API_BASE_URL}/resources/${params.id}`, {
      agent
    });

    if (!response.ok) {
      return new NextResponse('Resource not found', {
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
