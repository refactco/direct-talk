import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatSession {
  id: string
  contentId: string
  messages: Message[]
}

// In-memory storage for chat sessions
const chatSessions: Record<string, ChatSession> = {}

export async function POST(request: Request) {
  const { prompt, chat_id, content_id } = await request.json()

  let chatSession: ChatSession

  if (chat_id && chatSessions[chat_id]) {
    chatSession = chatSessions[chat_id]
  } else {
    const newChatId = uuidv4()
    chatSession = {
      id: newChatId,
      contentId: content_id,
      messages: [],
    }
    chatSessions[newChatId] = chatSession
  }

  // Add user message
  chatSession.messages.push({ role: "user", content: prompt })

  // Generate mock AI response
  const aiResponse = `This is a mock response to: "${prompt}"`
  chatSession.messages.push({ role: "assistant", content: aiResponse })

  return NextResponse.json({
    id: chatSession.id,
    messages: [{ role: "assistant", content: aiResponse }],
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const chatId = searchParams.get("id")

  if (!chatId || !chatSessions[chatId]) {
    return NextResponse.json({ error: "Chat session not found" }, { status: 404 })
  }

  return NextResponse.json(chatSessions[chatId])
}

