import { NextResponse } from 'next/server';
import { mockAuthors } from '../mocked-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const perPage = searchParams.get('per_page') || '4';

  try {
    const response = {
      people: mockAuthors.slice(0, parseInt(perPage))
    };

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
