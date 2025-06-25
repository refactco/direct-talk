import { API_BASE_URL } from '@/lib/constants';
import https from 'https';
import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { mockAuthors } from '../mocked-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get('per_page') || '4';
  const useMock = process.env.MOCKED_DATA === 'true';

  try {
    let response;

    if (useMock) {
      response = {
        people: mockAuthors.slice(0, parseInt(perPage))
      };
    } else {
      const apiUrl = `${API_BASE_URL}/people?${searchParams}`;

      const agent = new https.Agent({
        rejectUnauthorized: false
      });

      const apiResponse = await fetch(apiUrl, { agent });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(`Failed to fetch content creators: ${errorText}`);
      }

      response = await apiResponse.json();
    }

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Error fetching content creators'
      },
      { status: 500 }
    );
  }
}
