export interface Message {
  question?: string;
  answer?: string;
  resource_id?: string[];
  resources?: any[];
}

export interface ChatData {
  session_id: string;
  content_ids: string[];
  chat_history: Message[];
  created_at: string;
  session_title: string;
  user_id: string;
  author_id: number | null;
  author_name: string | null;
}

export interface IChatHistory {
  question: string;
  answer?: string;
  resource_id?: string[];
  resources?: any[];
}

export interface StartChatData {
  message?: string | null;
  contentIds?: string[] | null;
}
