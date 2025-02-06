import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  onAuthenticated
}: AuthModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("AuthModal isOpen:", isOpen); // Debug log
  }, [isOpen]);

  const handleAuth = (provider: string) => {
    setIsLoading(true);
    // Mock authentication process
    setTimeout(() => {
      setIsLoading(false);
      onAuthenticated();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in to continue</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button
            variant="outline"
            onClick={() => handleAuth("google")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.google className="mr-2 h-4 w-4" />
            )}
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleAuth("twitter")}
            disabled={isLoading}
          >
            {isLoading ? (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.twitter className="mr-2 h-4 w-4" />
            )}
            Twitter
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
