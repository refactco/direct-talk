import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_BASE_AI_API_URL as string;
const apiClient = axios.create({
  baseURL
});

apiClient.interceptors.request.use(
  async (config: any) => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem(
        'sb-wfcrrnfzcsoljbhxbsko-auth-token'
      );

      if (storedToken) {
        try {
          // Parse the stored session object from localStorage
          const session = JSON.parse(storedToken);
          const accessToken = session?.access_token;

          if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
          } else {
            console.warn('No access token found in stored session');
          }
        } catch (error) {
          console.error('Error parsing auth token:', error);
          // Clear invalid token from localStorage
          localStorage.removeItem('sb-wfcrrnfzcsoljbhxbsko-auth-token');
        }
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401 errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Received 401 Unauthorized response');
      // Clear auth token on 401 errors
      if (typeof window !== 'undefined') {
        localStorage.removeItem('sb-wfcrrnfzcsoljbhxbsko-auth-token');
      }
    }
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration or errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized! Token may be invalid or expired.');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
