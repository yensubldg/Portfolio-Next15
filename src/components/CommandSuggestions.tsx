"use client";

import React, { useEffect, useState } from "react";

interface CommandSuggestionsProps {
  input: string;
  selectedIndex: number;
  onSelect: (command: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const AVAILABLE_COMMANDS = [
  "help",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
  "theme",
  "matrix",
  "game",
  "clear",
  "cv",
  "status",
];

export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  input,
  selectedIndex,
  onSelect,
  inputRef,
  containerRef,
}) => {
  const [showAbove, setShowAbove] = useState(false);

  // Filter suggestions based on input
  const suggestions = !input.trim()
    ? []
    : AVAILABLE_COMMANDS.filter((cmd) =>
        cmd.toLowerCase().startsWith(input.toLowerCase())
      );

  // Calculate position
  const updatePosition = () => {
    if (!inputRef.current || !containerRef.current) return;

    const inputRect = inputRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const containerHeight = containerRect.height;
    const inputOffsetTop = inputRect.top - containerRect.top;

    // If input is in the top half of the terminal, show suggestions below
    // If input is in the bottom half, show suggestions above
    setShowAbove(inputOffsetTop > containerHeight / 2);
  };

  // Update position on input change
  useEffect(() => {
    updatePosition();
  }, [input]);

  // Update position on resize or scroll
  useEffect(() => {
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);
    containerRef.current?.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
      containerRef.current?.removeEventListener("scroll", updatePosition);
    };
  }, []);

  if (suggestions.length === 0) return null;

  return (
    <div
      className="suggestions absolute left-0 w-full z-50"
      style={{
        [showAbove ? "bottom" : "top"]: "100%",
        [showAbove ? "marginBottom" : "marginTop"]: "0.5rem",
      }}
    >
      <div className="bg-terminal-background border border-terminal-foreground/30 rounded shadow-glow overflow-hidden">
        {suggestions.map((suggestion, index) => (
          <div
            key={suggestion}
            className={`
              suggestion-item px-4 py-2 cursor-pointer flex justify-between items-center
              hover:bg-terminal-foreground/10 transition-colors
              ${index === selectedIndex ? "bg-terminal-foreground/20" : ""}
            `}
            onClick={() => onSelect(suggestion)}
          >
            <span className="command font-medium">{suggestion}</span>
          </div>
        ))}
        <div className="text-xs text-center p-1 border-t border-terminal-foreground/20">
          Use Tab/↑↓ to navigate, Enter to select
        </div>
      </div>
    </div>
  );
};

export default CommandSuggestions;
