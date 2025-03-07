"use client";

import React, { useEffect } from "react";
import { ThemeType, THEMES } from "../constants/themes";

interface ThemeProps {
  onThemeChange: (theme: ThemeType) => void;
  selectedTheme?: string;
}

export const Theme: React.FC<ThemeProps> = ({
  onThemeChange,
  selectedTheme,
}) => {
  // If selectedTheme is provided, apply it immediately
  useEffect(() => {
    if (selectedTheme) {
      const theme = THEMES.find(
        (t) => t.name.toLowerCase() === selectedTheme.toLowerCase()
      );
      if (theme) {
        handleThemeSelect(theme);
      }
    }
  }, [selectedTheme]);

  // Load theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("terminal-theme");
    if (savedTheme) {
      const theme = THEMES.find((t) => t.name === savedTheme);
      if (theme) {
        handleThemeSelect(theme);
      }
    }
  }, []);

  const handleThemeSelect = (theme: ThemeType) => {
    onThemeChange(theme);
    localStorage.setItem("terminal-theme", theme.name);
  };

  // If a theme name was provided but not found
  if (
    selectedTheme &&
    !THEMES.find((t) => t.name.toLowerCase() === selectedTheme.toLowerCase())
  ) {
    const themeList = THEMES.map((t) => t.name).join(", ");
    return (
      <div className="text-red-400">
        Theme not found: {selectedTheme}
        <div className="mt-2">Available themes: {themeList}</div>
      </div>
    );
  }

  // If no specific theme was requested, show the theme selector
  if (!selectedTheme) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="space-y-2">
          <div className="font-bold">Available Themes:</div>
          {THEMES.map((theme) => (
            <div
              key={theme.name}
              className={`
                p-2 rounded cursor-pointer transition-colors
                hover:bg-terminal-foreground/10
              `}
              onClick={() => handleThemeSelect(theme)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded-full border border-terminal-foreground/30"
                  style={{ background: theme.foreground }}
                />
                <span className="capitalize">{theme.name}</span>
                <span className="text-sm opacity-70">
                  - {theme.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm opacity-70">Usage: theme --set [name]</div>
      </div>
    );
  }

  // Theme was successfully set
  return <div className="text-green-400">Theme set to: {selectedTheme}</div>;
};

export default Theme;
