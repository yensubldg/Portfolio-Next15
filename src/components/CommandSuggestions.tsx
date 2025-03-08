"use client";

import React, { useEffect, useState } from "react";

interface CommandSuggestionsProps {
  input: string;
  selectedIndex: number;
  onSelect: (command: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface CommandInfo {
  name: string;
  description: string;
  args?: string;
}

const AVAILABLE_COMMANDS: CommandInfo[] = [
  { name: "help", description: "Show available commands" },
  { name: "about", description: "Learn about me" },
  {
    name: "skills",
    description: "View my technical skills",
    args: "--category [frontend|backend|devops]",
  },
  {
    name: "experience",
    description: "View my work experience",
    args: "--filter [company/type]",
  },
  { name: "projects", description: "View my projects" },
  { name: "contact", description: "Get in touch" },
  {
    name: "theme",
    description: "Change terminal theme",
    args: "--set [matrix|cyberpunk|retro|midnight]",
  },
  { name: "matrix", description: "Enter the matrix" },
  { name: "game", description: "Play snake game" },
  { name: "status", description: "Check my availability" },
  { name: "cv", description: "Download my resume" },
  { name: "clear", description: "Clear terminal" },
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
        cmd.name.toLowerCase().startsWith(input.toLowerCase())
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
        {suggestions.map((cmd, index) => (
          <div
            key={cmd.name}
            className={`
              suggestion-item px-4 py-2 cursor-pointer
              hover:bg-terminal-foreground/10 transition-colors
              ${index === selectedIndex ? "bg-terminal-foreground/20" : ""}
            `}
            onClick={() => onSelect(cmd.name)}
          >
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <span className="command font-medium">{cmd.name}</span>
                {cmd.args && (
                  <span className="text-terminal-foreground/50 ml-2 text-sm">
                    {cmd.args}
                  </span>
                )}
              </div>
              <span className="text-terminal-foreground/70 text-sm whitespace-nowrap">
                {cmd.description}
              </span>
            </div>
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
