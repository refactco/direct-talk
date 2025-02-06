import { authors } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();
  const limit = searchParams.get("limit")
    ? Number.parseInt(searchParams.get("limit")!)
    : undefined;

  let filteredAuthors = [...authors];

  if (query) {
    filteredAuthors = filteredAuthors.filter(
      (author) =>
        author.name.toLowerCase().includes(query) ||
        author.bio.toLowerCase().includes(query)
    );
  }

  // Sort authors by popularity (using the number of resources as a proxy for popularity)
  filteredAuthors.sort((a, b) => b.resources.length - a.resources.length);

  if (limit) {
    filteredAuthors = filteredAuthors.slice(0, limit);
  }

  return NextResponse.json(filteredAuthors);
}
