"use client";

import React, { useEffect, useState } from "react";

interface Command {
  name: string;
  description: string;
}

interface CommandSuggestionsProps {
  input: string;
  selectedIndex: number;
  onSelect: (command: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const AVAILABLE_COMMANDS: Command[] = [
  { name: "help", description: "Show available commands" },
  { name: "about", description: "Learn about me" },
  { name: "projects", description: "View my projects" },
  { name: "contact", description: "Get in touch" },
  { name: "clear", description: "Clear terminal" },
];

export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  input,
  selectedIndex,
  onSelect,
  inputRef,
}) => {
  const [showAbove, setShowAbove] = useState(true);

  useEffect(() => {
    const updatePosition = () => {
      if (!inputRef.current) return;

      const inputRect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - inputRect.bottom;
      const spaceAbove = inputRect.top;

      // Switch position based on available space
      // Add extra padding for the suggestions
      setShowAbove(spaceBelow < 200 && spaceAbove > spaceBelow);
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [inputRef]);

  const filteredCommands = AVAILABLE_COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().startsWith(input.toLowerCase())
  );

  if (!input || filteredCommands.length === 0) return null;

  return (
    <div
      className={`suggestions absolute ${
        showAbove ? "bottom-full mb-2" : "top-full mt-2"
      } left-0 w-full z-10`}
      style={{
        maxHeight: "200px",
        overflowY: "auto",
      }}
    >
      {filteredCommands.map((command, index) => (
        <div
          key={command.name}
          className={`suggestion-item ${
            index === selectedIndex ? "selected" : ""
          }`}
          onClick={() => onSelect(command.name)}
        >
          <span className="command text-sm sm:text-base">{command.name}</span>
          <span className="description hidden sm:inline">
            {command.description}
          </span>
          <span className="description sm:hidden">
            {command.description.length > 20
              ? command.description.slice(0, 20) + "..."
              : command.description}
          </span>
        </div>
      ))}
      <div className="text-xs text-center p-1 border-t border-terminal-foreground/20">
        Use ↑↓ to navigate, Tab to complete, Enter to select
      </div>
    </div>
  );
};

export default CommandSuggestions;
