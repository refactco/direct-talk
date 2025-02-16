export interface Message {
  role: 'user' | 'assistant';
  content?: string;
  message?: string;
}

export interface ChatData {
  session_id: string;
  content_ids: string[];
  results: Message[];
}
