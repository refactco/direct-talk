import { resources } from '@/lib/mocked/data';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const resource = resources.find((r) => r.id === params.id);

  if (!resource) {
    return new NextResponse('Resource not found', { status: 404 });
  }

  return NextResponse.json(resource);
}
