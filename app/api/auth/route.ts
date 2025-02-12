import { NextResponse } from "next/server";

// Mock user data
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" }
];

export async function POST(request: Request) {
  const { provider } = await request.json();

  // Simulate a delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Generate a random token
  const token = Math.random().toString(36).substr(2);

  // Randomly select a user
  const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];

  return NextResponse.json({ token, user });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  // In a real application, you would validate the token here
  // For this mock, we'll just check if it exists

  if (token) {
    // Randomly select a user
    const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
    return NextResponse.json({ user });
  } else {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
