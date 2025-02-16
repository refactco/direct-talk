export interface Message {
  role: 'user' | 'assistant';
  content?: string;
  message?: string;
}

export interface ChatData {
  id: string;
  content_id: string;
  messages: Message[];
}
