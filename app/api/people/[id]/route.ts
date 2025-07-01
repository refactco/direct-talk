import { NextResponse } from 'next/server';
import { mockAuthors } from '../../mocked-data';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const foundAuthor = mockAuthors.find(
      (author) => author.id === parseInt(id)
    );

    return NextResponse.json(foundAuthor);
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
