export interface Message {
  question?: string;
  answer?: string;
}

export interface ChatData {
  session_id: string;
  content_ids: string[];
  chat_history: Message[];
  created_at: string;
  session_title: string;
  user_id: string;
}
