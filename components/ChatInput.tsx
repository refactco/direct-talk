'use client';

// import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
// import { PlusIcon } from '@/components/icons/PlusIcon';
import { useToast } from '@/hooks/use-toast';
import toastConfig from '@/lib/toast-config';
import { cn } from '@/lib/utils';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { SelectedResourcesList } from './selected-resources-list/selected-resources-list';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  onAddResource?: () => void;
  hideResources?: boolean;
  isLoading: boolean;
  placeholder?: string;
  resetAfterSubmit?: boolean;
  defaultValue?: string;
  disabled?: boolean;
}

export function ChatInput({
  onSubmit,
  onAddResource,
  hideResources = false,
  isLoading,
  placeholder = 'Ask AI anything...',
  resetAfterSubmit = false,
  defaultValue,
  disabled = false
}: ChatInputProps) {
  const [input, setInput] = useState(defaultValue ?? '');
  const { toast } = useToast();

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
      <div
        className={cn(
          'rounded-3xl border bg-background overflow-hidden transition-all duration-300',
          hideResources ? 'rounded-[62.4375rem]' : 'rounded-3xl',
          disabled ? 'border-border' : 'border-neutral-400'
        )}
        onPointerDown={(e) => {
          if (disabled) {
            e.preventDefault();
            const tConfig: any = toastConfig({
              message: 'Please select a person first',
              toastType: 'destructive'
            });
            toast(tConfig);
          }
        }}
      >
        {/* Selected Resources */}
        {hideResources ? null : (
          <SelectedResourcesList customClassName="p-3 border-b border-border" />
        )}
        {/* Input Area */}
        <div
          className={cn(
            'flex items-center px-3 gap-2 md:gap-4',
            hideResources ? 'flex-row' : 'flex-col'
          )}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            className={cn(
              'w-full py-6 flex-grow bg-background border-0 focus:outline-none focus:ring-0 text-xs md:text-sm resize-none pl-2 md:pl-5',
              hideResources ? 'flex-1' : '',
              disabled ? 'placeholder-neutral-700' : 'placeholder-[#a2a2a4]'
            )}
            style={{
              touchAction: 'manipulation'
            }}
            disabled={isLoading || disabled}
            defaultValue={defaultValue}
          />
          <div
            className={cn(
              'flex items-center',
              hideResources ? 'justify-end' : 'justify-between w-full'
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
              className="w-8 h-8 sm:w-10 md:h-10 rounded-full bg-primary hover:bg-primary/90 focus:bg:primary/70 flex items-center justify-center shrink-0 disabled:bg-neutral-900 disabled:cursor-not-allowed"
            >
              <ArrowRightIcon
                className={cn(
                  'w-5 h-5',
                  !input.trim() ? 'text-neutral-500' : 'text-black'
                )}
              />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
