import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { XIcon } from '@/components/icons/XIcon';
import { CloseIcon } from '@/components/icons/CloseIcon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { login, closeAuthModal } = useAuth();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingTwitter, setIsLoadingTwitter] = useState<boolean>(false);

  const handleAuth = async (provider: string) => {
    if (provider === 'google') {
      setIsLoadingGoogle(true);
    } else if (provider === 'twitter') {
      setIsLoadingTwitter(true);
    }
    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ provider })
      });

      if (!response.ok) {
        throw new Error('Authentication failed');
      }

      const { token, user } = await response.json();
      login(token, user);
    } catch (error) {
      console.error('Authentication error:', error);
    } finally {
      setIsLoadingGoogle(false);
      setIsLoadingTwitter(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[461px] bg-background border-border p-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => closeAuthModal()}
          className="rounded-full border border-border absolute right-4 top-4"
        >
          <CloseIcon className="h-5 w-5 fill-foreground" />
        </Button>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Let’s get you In!
          </DialogTitle>
          <p className="text-center text-sm mt-3 text-muted-foreground">
            Login in with a social account to start your search.
          </p>
        </DialogHeader>
        <div className="grid gap-4 pt-2 w-full max-w-[203px] m-auto">
          <Button
            variant="default"
            className="bg-foreground font-semibold hover:bg-foreground/90 rounded-[6px]"
            onClick={() => handleAuth('google')}
            disabled={isLoadingGoogle}
          >
            {isLoadingGoogle ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <GoogleIcon className="fill-primary-foreground" />
            )}
            Login with Google
          </Button>
          <Button
            variant="default"
            className="bg-foreground font-semibold hover:bg-foreground/90 rounded-[6px]"
            onClick={() => handleAuth('twitter')}
            disabled={isLoadingTwitter}
          >
            {isLoadingTwitter ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XIcon className="fill-primary-foreground" />
            )}
            Login with X
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
