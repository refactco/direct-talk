'use client';

// import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
// import { PlusIcon } from '@/components/icons/PlusIcon';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, Loader2, PlusIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { SelectedResourcesList } from './selected-resources-list/selected-resources-list';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onAddResource: () => void;
  hideResources?: boolean;
  isLoading: boolean;
  placeholder?: string;
  resetAfterSubmit?: boolean;
  defaultValue?: string;
}

export function ChatInput({
  onSubmit,
  onAddResource,
  hideResources = false,
  isLoading,
  placeholder = 'Ask AI anything...',
  resetAfterSubmit = false,
  defaultValue
}: ChatInputProps) {
  const [input, setInput] = useState(defaultValue ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input?.trim() && !isLoading) {
      onSubmit(input?.trim());
      if (resetAfterSubmit) {
        setInput('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="rounded-3xl border border-border bg-background overflow-hidden">
        {/* Selected Resources */}
        {hideResources ? null : (
          <SelectedResourcesList customClassName="p-3 border-b border-border" />
        )}
        {/* Input Area */}
        <div className="flex flex-col items-center p-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full flex-grow bg-background border-0 focus:outline-none focus:ring-0 placeholder-[#a2a2a4] text-xs md:text-xsm pt-2 resize-none"
            disabled={isLoading}
            defaultValue={defaultValue}
          />
          <div
            className={cn(
              'flex items-center justify-between w-full',
              hideResources ? 'justify-end' : 'justify-between'
            )}
          >
            {hideResources ? null : (
              <button
                type="button"
                className="flex gap-2 items-center text-[13px] font-semibold"
                onClick={onAddResource}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-accent-light hover:bg-accent-light/70 focus:bg-accent-light/60 transition-colors">
                  <PlusIcon className="fill-foreground h-5 w-5" />
                </div>
                Add resource
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="w-8 h-8 sm:w-10 md:h-10 rounded-full bg-primary hover:bg-primary/90 focus:bg:primary/70 flex items-center justify-center shrink-0 disabled:bg-accent-light disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ArrowRightIcon
                  className={cn('w-5 h-5', !input.trim() ? '' : 'text-black')}

                  // fill={!input.trim() ? 'rgba(161, 161, 161, 1)' : '#052E16'}
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
