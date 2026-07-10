"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // When mounted on the client, set mounted to true
  React.useEffect(() => {
    setMounted(true);
  }, []);

  // If not mounted yet, render a default state to avoid hydration mismatch.
  // We render a default unchecked switch on the server.
  if (!mounted) {
    return (
      <div className="flex items-center space-x-2">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <Label htmlFor="dark-mode-switch" className="sr-only">
          Toggle dark mode
        </Label>
        <Switch
          id="dark-mode-switch"
          checked={false} // Default to unchecked on server
          aria-label="Toggle dark mode"
          disabled // Disable interaction until mounted to prevent errors
        />
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      </div>
    );
  }

  // Once mounted, use the resolvedTheme to determine the checked state
  const isDarkMode = resolvedTheme === "dark";

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2">
      <Sun className="h-[1.2rem] w-[1.2rem]" />
      <Label htmlFor="dark-mode-switch" className="sr-only">
        Toggle dark mode
      </Label>
      <Switch
        id="dark-mode-switch"
        checked={isDarkMode}
        onCheckedChange={handleToggle}
        aria-label="Toggle dark mode"
      />
      <Moon className="h-[1.2rem] w-[1.2rem]" />
    </div>
  );
}
