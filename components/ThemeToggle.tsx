'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Ensure the component only renders on the client
    setMounted(true);
  }, []);

  // If the component hasn't mounted yet, don't render anything

  React.useEffect(() => {
    console.log('ThemeToggle mounted');
    console.log('Initial theme:', theme);
  }, [theme]); // Added theme to dependencies

  React.useEffect(() => {
    console.log('Theme changed to:', theme);
  }, [theme]);

  const toggleTheme = () => {
    console.log('Toggle button clicked');
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    console.log('Setting theme to:', newTheme);
    setTheme(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="w-9 h-9 rounded-full"
    >
      {theme === 'dark' ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
