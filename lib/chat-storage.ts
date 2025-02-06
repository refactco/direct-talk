export function getChatId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("chat_id");
}

export function setChatId(chatId: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("chat_id", chatId);
}

export function clearChatId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("chat_id");
}
