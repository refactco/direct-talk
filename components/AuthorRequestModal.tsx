'use client';

import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface AuthorRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthorRequestModal({
  isOpen,
  onClose
}: AuthorRequestModalProps) {
  const [authorName, setAuthorName] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isAuthenticated, openAuthModal } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal();
      onClose();
      return;
    }

    if (!authorName.trim()) {
      toast.error('Please enter an author name');
      return;
    }

    setIsSubmitting(true);

    try {
      // Get the user's session token
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        toast.error('Authentication required. Please log in again.');
        openAuthModal();
        onClose();
        return;
      }

      const response = await fetch('/api/author-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          authorName: authorName.trim(),
          additionalNotes: additionalNotes.trim(),
          userToken: session.access_token
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Author request submitted successfully!');
        setAuthorName('');
        setAdditionalNotes('');
        onClose();
      } else {
        toast.error(data.error || 'Failed to submit request');
        if (response.status === 401) {
          openAuthModal();
          onClose();
        }
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setAuthorName('');
      setAdditionalNotes('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] p-6">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-2xl font-semibold">
            Request an Author
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground leading-relaxed">
            Tell us which author or thinker you'd like to see added to our
            platform. We'll consider all suggestions for future additions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-3">
            <Label htmlFor="authorName" className="text-sm font-medium">
              Author Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="authorName"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="e.g., Jordan Peterson, Tim Ferriss, Naval Ravikant..."
              disabled={isSubmitting}
              required
              className="text-base"
            />
          </div>

          <div className="space-y-3">
            <Label htmlFor="additionalNotes" className="text-sm font-medium">
              Additional Notes
              <span className="text-muted-foreground font-normal ml-1">
                (Optional)
              </span>
            </Label>
            <Textarea
              id="additionalNotes"
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Any specific books, podcasts, interviews, or content you'd like us to prioritize when creating this author's knowledge base..."
              disabled={isSubmitting}
              rows={4}
              className="text-base leading-relaxed resize-none"
            />
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[140px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
