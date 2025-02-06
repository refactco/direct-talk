import { authors, resources } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const author = authors.find((a) => a.id === params.id);

  if (!author) {
    return new NextResponse("Author not found", { status: 404 });
  }

  const authorResources = resources.filter((r) => r.authorId === author.id);

  return NextResponse.json({
    ...author,
    resources: authorResources
  });
}
