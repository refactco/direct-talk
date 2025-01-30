import type { NextRequest } from "next/server"
import { sleep } from "@/lib/utils"

export async function POST(req: NextRequest) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  // Simulate network delay
  await sleep(1000)

  // Create a mock stream
  const stream = new ReadableStream({
    async start(controller) {
      const mockResponse = `This response is generated from the knowledge contained in your selected resources. Let me know if you have any follow-up questions!`

      // Stream the response word by word
      const words = mockResponse.split(" ")
      for (const word of words) {
        const encoder = new TextEncoder()
        const chunk = encoder.encode(word + " ")
        controller.enqueue(chunk)
        await sleep(50) // Add small delay between words
      }
      controller.close()
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  })
}

