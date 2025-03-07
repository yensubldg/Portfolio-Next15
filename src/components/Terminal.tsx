"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTypingEffect } from "../hooks/useTypingEffect";
import CommandSuggestions from "./CommandSuggestions";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";

interface Command {
  input: string;
  output: React.ReactNode;
}

export const Terminal: React.FC = () => {
  const welcomeText =
    'Welcome to my portfolio terminal.\nType "help" to see available commands.';
  const { displayedText, isComplete } = useTypingEffect(welcomeText, 40);

  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleCommand = (command: string) => {
    const cmd = command.toLowerCase().trim();
    let output: React.ReactNode;

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1 text-sm sm:text-base">
            <p>Available commands:</p>
            <p>about - Learn about me</p>
            <p>projects - View my projects</p>
            <p>contact - Get in touch</p>
            <p>clear - Clear terminal</p>
            <p>help - Show this help message</p>
          </div>
        );
        break;
      case "clear":
        setHistory([]);
        return;
      case "about":
        output = <About />;
        break;
      case "projects":
        output = <Projects />;
        break;
      case "contact":
        output = <Contact />;
        break;
      default:
        output = `Command not found: ${command}. Type 'help' for available commands.`;
    }

    setHistory((prev) => [...prev, { input: command, output }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
    setSelectedSuggestionIndex(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl + C
    if (e.ctrlKey && e.key === "c") {
      setInput("");
      setHistory((prev) => [
        ...prev,
        {
          input: input || "^C",
          output: null,
        },
      ]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      return;
    }

    // Handle Tab completion
    if (e.key === "Tab") {
      e.preventDefault();
      const suggestions = [
        "help",
        "about",
        "projects",
        "contact",
        "clear",
      ].filter((cmd) => cmd.startsWith(input.toLowerCase()));

      if (suggestions.length === 1) {
        setInput(suggestions[0]);
      }
      return;
    }

    // Handle arrow keys for suggestions
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => Math.min(4, prev + 1));
      return;
    }

    // Handle Enter on suggestion
    if (e.key === "Enter" && input) {
      const suggestions = [
        "help",
        "about",
        "projects",
        "contact",
        "clear",
      ].filter((cmd) => cmd.startsWith(input.toLowerCase()));

      if (suggestions[selectedSuggestionIndex]) {
        e.preventDefault();
        handleCommand(suggestions[selectedSuggestionIndex]);
        setInput("");
        setSelectedSuggestionIndex(0);
        return;
      }
    }
  };

  const handleSuggestionSelect = (command: string) => {
    setInput(command);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle welcome message
  useEffect(() => {
    if (displayedText) {
      setHistory([
        {
          input: "",
          output: (
            <div className="whitespace-pre-line text-sm sm:text-base">
              {displayedText}
              {!isComplete && <span className="animate-pulse">|</span>}
            </div>
          ),
        },
      ]);
    }
  }, [displayedText]);

  // Update typing state when welcome message is complete
  useEffect(() => {
    setIsTyping(!isComplete);
  }, [isComplete]);

  // Auto-scroll and focus management
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  }, [history, isTyping]);

  return (
    <div className="terminal-window">
      <div className="terminal-header">
        <div className="terminal-dot bg-red-500"></div>
        <div className="terminal-dot bg-yellow-500"></div>
        <div className="terminal-dot bg-green-500"></div>
      </div>

      <div ref={containerRef} className="terminal-content">
        {history.map((entry, i) => (
          <div key={i} className="space-y-1">
            {entry.input && (
              <div className="terminal-line">
                <span className="terminal-prompt text-sm sm:text-base">$</span>
                <span className="ml-2 text-sm sm:text-base">{entry.input}</span>
              </div>
            )}
            <div className="terminal-line pl-4 sm:pl-6">{entry.output}</div>
          </div>
        ))}

        {!isTyping && (
          <div className="relative">
            <CommandSuggestions
              input={input}
              selectedIndex={selectedSuggestionIndex}
              onSelect={handleSuggestionSelect}
              inputRef={inputRef}
            />
            <form
              onSubmit={handleSubmit}
              className="terminal-line mt-2 sm:mt-4"
            >
              <span className="terminal-prompt text-sm sm:text-base">$</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setSelectedSuggestionIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="terminal-input ml-2 text-sm sm:text-base"
                autoFocus
                spellCheck={false}
                autoComplete="off"
              />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
