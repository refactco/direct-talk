import { setChatId } from "./chat-storage"

const HISTORY_STORAGE_KEY = "chat_history"

export interface ChatHistoryItem {
  id: string
  title: string
  contentId: string
  createdAt: string
}

export function getChatHistory(): ChatHistoryItem[] {
  if (typeof window === "undefined") return []
  const history = localStorage.getItem(HISTORY_STORAGE_KEY)
  return history ? JSON.parse(history) : []
}

export function addChatToHistory(chat: ChatHistoryItem): void {
  if (typeof window === "undefined") return
  const history = getChatHistory()
  const updatedHistory = [chat, ...history.filter((item) => item.id !== chat.id)].slice(0, 10)
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
}

export function removeChatFromHistory(chatId: string): void {
  if (typeof window === "undefined") return
  const history = getChatHistory()
  const updatedHistory = history.filter((item) => item.id !== chatId)
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory))
}

export function clearChatHistory(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(HISTORY_STORAGE_KEY)
}

export async function createNewChat(contentId: string, question: string): Promise<string> {
  try {
    const response = await fetch("https://api-focus.sajjadrad.com/v1/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Bearer TEST_API_KEY",
      },
      body: new URLSearchParams({
        content_id: contentId,
        prompt: question,
      }).toString(),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
    }

    const data = await response.json()

    if (!data.id) {
      throw new Error("No chat ID returned from the API")
    }

    const chatId = data.id

    setChatId(chatId)

    addChatToHistory({
      id: chatId,
      title: question,
      contentId,
      createdAt: new Date().toISOString(),
    })

    return chatId
  } catch (error) {
    console.error("Error in createNewChat:", error)
    throw error
  }
}

export async function getPreviousChat(chatId: string): Promise<any> {
  const response = await fetch(`https://api-focus.sajjadrad.com/v1/chat/${chatId}`, {
    headers: {
      Authorization: "Bearer TEST_API_KEY",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch previous chat")
  }

  return response.json()
}

