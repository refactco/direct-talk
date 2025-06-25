'use client';

import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loginWithGoogle: () => void;
  loginWithTwitter: () => void; // Added Twitter login
  logout: () => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  isLoading: boolean;
}

const AUTH_AVATAR_KEY = 'auth_user_avatar';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Helper function to store avatar in localStorage
  const storeAvatarInLocalStorage = (avatar: string | undefined) => {
    if (avatar) {
      localStorage.setItem(AUTH_AVATAR_KEY, avatar);
    }
  };

  // Helper function to get avatar from localStorage
  const getAvatarFromLocalStorage = (): string | undefined => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_AVATAR_KEY) || undefined;
    }
    return undefined;
  };

  useEffect(() => {
    const checkUserSession = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.auth.getSession();
      if (data.session) {
        const { user } = data.session;
        const avatar =
          user.user_metadata?.avatar_url || getAvatarFromLocalStorage();

        // Store avatar in localStorage if present
        if (avatar) {
          storeAvatarInLocalStorage(avatar);
        }

        setUser({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || '',
          avatar
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      if (error?.message) {
        console.error('Auth session error:', error.message);
      }
      setIsLoading(false);
    };

    checkUserSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          const avatar =
            session.user.user_metadata?.avatar_url ||
            getAvatarFromLocalStorage();

          // Store avatar in localStorage if present
          if (avatar) {
            storeAvatarInLocalStorage(avatar);
          }

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.full_name || '',
            avatar
          });
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loginWithGoogle = async () => {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}` }
    });
    if (error) {
      console.error('Google Login Error:', error.message);
    }
  };

  const loginWithTwitter = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'twitter',

      options: { redirectTo: `${window.location.origin}` }
    });
    if (error) {
      console.error('Twitter Login Error:', error.message);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    // Clear avatar from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_AVATAR_KEY);
    }
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    router.push('/');
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loginWithGoogle,
        loginWithTwitter,
        logout,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
