'use client';
import { Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { SunIcon } from '@/components/icons/SunIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function ThemeToggle(props: { className?: string }) {
  const { className } = props;
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className={cn('border border-border rounded-full h-8 w-8', className)}
    >
      <SunIcon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
