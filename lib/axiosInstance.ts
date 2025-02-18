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
          }
        } catch (error) {
          console.error('Error parsing auth token:', error);
        }
      }
    }

    return config;
  },
  (error) => {
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
