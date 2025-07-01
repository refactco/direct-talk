'use client';

// import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon';
// import { PlusIcon } from '@/components/icons/PlusIcon';
import { cn } from '@/lib/utils';
import { ArrowUpIcon } from 'lucide-react';
import type React from 'react';
import { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface ChatInputProps {
  onSubmit: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
  resetAfterSubmit?: boolean;
  defaultValue?: string;
  disabled?: boolean;
  className?: string;
}

export interface ChatInputRef {
  focus: () => void;
  blur: () => void;
}

export const ChatInput = forwardRef<ChatInputRef, ChatInputProps>(({
  onSubmit,
  isLoading,
  placeholder = 'Ask AI anything...',
  resetAfterSubmit = false,
  defaultValue,
  disabled = false,
  className
}: ChatInputProps, ref) => {
  const [input, setInput] = useState(defaultValue ?? '');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const maxLength = 200;

  // Expose focus and blur methods to parent components
  useImperativeHandle(ref, () => ({
    focus: () => {
      textareaRef.current?.focus();
    },
    blur: () => {
      textareaRef.current?.blur();
    }
  }), []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (input?.trim() && !isLoading && input.length <= maxLength) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setInput(value);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={cn(
            'relative bg-card rounded-3xl shadow-sm transition-all duration-200',
            'px-4 py-3 border-2 border-transparent',
            'focus-within:border-primary focus-within:shadow-lg',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )}
          onPointerDown={(e) => {
            if (disabled) {
              e.preventDefault();
              console.log('Please select a person first');
            }
          }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            maxLength={maxLength}
            className={cn(
              'w-full bg-transparent text-foreground placeholder-muted-foreground resize-none border-0 outline-none',
              'text-sm sm:text-base leading-5 sm:leading-6 min-h-[20px] sm:min-h-[24px] max-h-32',
              'scrollbar-hide pb-2',
              'focus:outline-none focus:ring-0'
            )}
            style={{
              touchAction: 'manipulation',
              overflow: 'hidden'
            }}
            disabled={isLoading || disabled}
          />

          {/* Bottom row with character counter and submit button */}
          <div className="flex items-center justify-end gap-2">
            <span className="text-xs text-muted-foreground">
              {input.length}/{maxLength}
            </span>

            <button
              type="submit"
              disabled={
                isLoading ||
                !input.trim() ||
                disabled ||
                input.length > maxLength
              }
              className={cn(
                'flex items-center justify-center',
                'w-8 h-8 rounded-full transition-all duration-200',
                'bg-primary hover:bg-primary/90 disabled:bg-muted disabled:cursor-not-allowed',
                'text-primary-foreground disabled:text-muted-foreground',
                'disabled:opacity-50'
              )}
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';
