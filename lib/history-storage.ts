import { setChatId } from './chat-storage';

const HISTORY_STORAGE_KEY = 'chat_history';

export interface ChatHistoryItem {
  id: string;
  title: string;
  contentId: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function getChatHistory(): ChatHistoryItem[] {
  if (typeof window === 'undefined') return [];
  const history = localStorage.getItem(HISTORY_STORAGE_KEY);
  return history ? JSON.parse(history) : [];
}

export function addChatToHistory(chat: ChatHistoryItem): void {
  if (typeof window === 'undefined') return;
  const history = getChatHistory();
  const updatedHistory = [
    chat,
    ...history.filter((item) => item.id !== chat.id)
  ].slice(0, 10);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

  // Dispatch a custom event to notify that the chat history has been updated
  window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
}

export function removeChatFromHistory(chatId: string): void {
  if (typeof window === 'undefined') return;
  const history = getChatHistory();
  const updatedHistory = history.filter((item) => item.id !== chatId);
  localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));

  // Dispatch a custom event to notify that the chat history has been updated
  window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
}

export function clearChatHistory(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(HISTORY_STORAGE_KEY);

  // Dispatch a custom event to notify that the chat history has been cleared
  window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
}

export async function createNewChat(
  contentId: string,
  question: string
): Promise<string> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: question,
        content_id: contentId
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    const data = await response.json();

    if (!data.id) {
      throw new Error('No chat ID returned from the API');
    }

    const chatId = data.id;

    setChatId(chatId);

    addChatToHistory({
      id: chatId,
      title: question,
      contentId,
      createdAt: new Date().toISOString()
    });

    return chatId;
  } catch (error) {
    console.error('Error in createNewChat:', error);
    throw error;
  }
}

export async function getPreviousChat(chatId: string): Promise<any> {
  const response = await fetch(`/api/chat?id=${chatId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch previous chat');
  }

  const data = await response.json();

  return data;
}

export async function addMessageToChat(
  chatId: string,
  message: Message
): Promise<void> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        prompt: message.content,
        content_id: '' // Add content_id if needed
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `HTTP error! status: ${response.status}, body: ${errorText}`
      );
    }

    // Update local storage if needed
    const history = getChatHistory();
    const chatIndex = history.findIndex((item) => item.id === chatId);
    if (chatIndex !== -1) {
      history[chatIndex].title = message.content; // Update the title with the latest message
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));

      // Dispatch a custom event to notify that the chat history has been updated
      window.dispatchEvent(new CustomEvent('chatHistoryUpdated'));
    }
  } catch (error) {
    console.error('Error in addMessageToChat:', error);
    throw error;
  }
}
