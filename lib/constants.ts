// API URLs - These should be in .env.local as server-side environment variables
export const API_BASE_URL = `${process.env.NEXT_PUBLIC_BASE_PUBLIC_API_URL}/wp-json/direct-talk/v1`;

// Note: AI_API_BASE_URL should be server-side only, not exposed to client
// SUPABASE_AUTH_TOKEN_KEY should be server-side only, not exposed to client
