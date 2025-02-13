"use client";
import { Moon } from "lucide-react";
import { useTheme } from "next-themes";

import { SunIcon } from "@/components/icons/SunIcon";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="absolute top-4 md:top-8 right-4 md:right-8 z-50 border border-border rounded-full"
    >
      <SunIcon className="absolute h-8 w-8 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <Moon className="h-8 w-8 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
