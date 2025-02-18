'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { GoogleIcon } from '@/components/icons/GoogleIcon';
import { XIcon } from '@/components/icons/XIcon'; // Add XIcon for Twitter
import { CloseIcon } from '@/components/icons/CloseIcon';
import { useAuth } from '@/contexts/AuthContext';
import { Icons } from './icons';

export function AuthModal() {
  const { loginWithGoogle, loginWithTwitter, isAuthModalOpen, closeAuthModal } =
    useAuth();
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingTwitter, setIsLoadingTwitter] = useState<boolean>(false);

  const handleGoogleAuth = async () => {
    setIsLoadingGoogle(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error('Google Authentication Error:', error);
    } finally {
      setIsLoadingGoogle(false);
    }
  };

  const handleTwitterAuth = async () => {
    setIsLoadingTwitter(true);
    try {
      await loginWithTwitter();
    } catch (error) {
      console.error('Twitter Authentication Error:', error);
    } finally {
      setIsLoadingTwitter(false);
    }
  };

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={closeAuthModal}>
      <DialogContent className="max-w-[461px] bg-background border-border p-16">
        <Button
          variant="ghost"
          size="icon"
          onClick={closeAuthModal}
          className="rounded-full border border-border absolute right-4 top-4"
        >
          <CloseIcon className="h-5 w-5 fill-foreground" />
        </Button>
        <DialogHeader>
          <DialogTitle className="text-center text-xl">
            Let’s get you In!
          </DialogTitle>
          <p className="text-center text-sm mt-3 text-muted-foreground">
            Login with a social account to start your search.
          </p>
        </DialogHeader>
        <div className="grid gap-4 pt-2 w-full max-w-[203px] m-auto">
          <Button
            variant="default"
            className="bg-foreground font-semibold hover:bg-foreground/90 rounded-[6px]"
            onClick={handleGoogleAuth}
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
            onClick={handleTwitterAuth}
            disabled={isLoadingTwitter}
          >
            {isLoadingTwitter ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XIcon className="fill-primary-foreground" />
            )}
            Login with Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
