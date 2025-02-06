import { topics } from "@/lib/data";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase();

  let filteredTopics = [...topics];

  if (query) {
    filteredTopics = filteredTopics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query)
    );
  }

  return NextResponse.json(filteredTopics);
}
