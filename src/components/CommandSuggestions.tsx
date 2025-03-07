"use client";

import React, { useEffect } from "react";
import { THEMES } from "../constants/themes";

interface CommandSuggestionsProps {
  input: string;
  selectedIndex: number;
  onSelect: (command: string) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

interface CommandOption {
  command: string;
  args?: {
    flag: string;
    options: string[];
  };
  description: string;
}

const COMMAND_OPTIONS: CommandOption[] = [
  { command: "help", description: "Show available commands" },
  { command: "about", description: "Learn about me" },
  {
    command: "skills",
    args: {
      flag: "--category",
      options: ["frontend", "backend", "devops"],
    },
    description: "View my technical skills",
  },
  {
    command: "experience",
    args: {
      flag: "--filter",
      options: ["fulltime", "contract"],
    },
    description: "View my work experience",
  },
  { command: "projects", description: "View my projects" },
  { command: "contact", description: "Get in touch" },
  {
    command: "theme",
    args: {
      flag: "--set",
      options: THEMES.map((t) => t.name),
    },
    description: "Change terminal theme",
  },
  { command: "matrix", description: "Enter the matrix" },
  { command: "game", description: "Play snake game" },
  { command: "cv", description: "Download my resume" },
  { command: "status", description: "Check my availability" },
  { command: "clear", description: "Clear terminal" },
];

export const CommandSuggestions: React.FC<CommandSuggestionsProps> = ({
  input,
  selectedIndex,
  onSelect,
  inputRef,
  containerRef,
}) => {
  const [showAbove, setShowAbove] = React.useState(true);
  const suggestionsRef = React.useRef<HTMLDivElement>(null);

  // Update position based on available space
  useEffect(() => {
    const updatePosition = () => {
      if (!inputRef.current || !containerRef.current || !suggestionsRef.current)
        return;

      const inputRect = inputRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const suggestionsHeight = suggestionsRef.current.offsetHeight;

      const spaceBelow = containerRect.bottom - inputRect.bottom;
      const spaceAbove = inputRect.top - containerRect.top;

      setShowAbove(spaceBelow < suggestionsHeight && spaceAbove > spaceBelow);
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);

    return () => window.removeEventListener("resize", updatePosition);
  }, [inputRef, containerRef]);

  // Don't show suggestions if input is empty
  if (!input.trim()) return null;

  // Parse input for command and args
  const parts = input.toLowerCase().trim().split(" ");
  const cmd = parts[0];
  const lastPart = parts[parts.length - 1];
  const isTypingFlag = lastPart.startsWith("-");
  const previousFlag = parts[parts.length - 2];

  // Find matching command
  const matchingCommand = COMMAND_OPTIONS.find((c) => c.command === cmd);

  // Get suggestions based on input
  let suggestions: { text: string; description: string }[] = [];

  if (!matchingCommand || isTypingFlag) {
    // Suggest commands
    suggestions = COMMAND_OPTIONS.filter((option) =>
      option.command.startsWith(lastPart)
    ).map((option) => ({
      text: option.command,
      description: option.description,
    }));
  } else if (
    matchingCommand.args &&
    previousFlag === matchingCommand.args.flag
  ) {
    // Suggest argument values
    suggestions = matchingCommand.args.options
      .filter((opt) => opt.startsWith(lastPart))
      .map((opt) => ({
        text: parts.slice(0, -1).concat(opt).join(" "),
        description: `Set ${matchingCommand.args?.flag} to ${opt}`,
      }));
  } else if (matchingCommand.args && parts.length === 1) {
    // Suggest flag
    suggestions = [
      {
        text: `${cmd} ${matchingCommand.args.flag}`,
        description: `Use ${matchingCommand.args.flag} to filter`,
      },
    ];
  }

  // Don't show suggestions if no matches
  if (suggestions.length === 0) return null;

  return (
    <div
      ref={suggestionsRef}
      className={`suggestions absolute ${
        showAbove ? "bottom-full mb-2" : "top-full mt-2"
      } left-0 w-full z-10 max-h-[200px] overflow-auto`}
    >
      {suggestions.map((suggestion, index) => (
        <div
          key={suggestion.text}
          className={`suggestion-item ${
            index === selectedIndex ? "selected" : ""
          }`}
          onClick={() => onSelect(suggestion.text)}
        >
          <span className="command text-sm sm:text-base">
            {suggestion.text}
          </span>
          <span className="description hidden sm:inline">
            {suggestion.description}
          </span>
          <span className="description sm:hidden">
            {suggestion.description.length > 20
              ? suggestion.description.slice(0, 20) + "..."
              : suggestion.description}
          </span>
        </div>
      ))}

      <div className="text-xs text-center p-1 border-t border-terminal-foreground/20">
        Use Tab/↑↓ to navigate, Enter to select
      </div>
    </div>
  );
};

export default CommandSuggestions;
