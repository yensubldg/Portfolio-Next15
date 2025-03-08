"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTypingEffect } from "../hooks/useTypingEffect";
import CommandSuggestions from "./CommandSuggestions";
import About from "./About";
import Projects from "./Projects";
import Contact from "./Contact";
import Skills from "./Skills";
import Experience from "./Experience";
import { Theme } from "./Theme";
import Matrix from "./Matrix";
import SnakeGame from "./SnakeGame";
import Status from "./Status";
import { ThemeType, DEFAULT_THEME, getTheme } from "../constants/themes";

interface Command {
  input: string;
  output: React.ReactNode;
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

export const Terminal: React.FC = () => {
  const welcomeText =
    'Welcome to my portfolio terminal.\nType "help" to see available commands.';
  const { displayedText, isComplete } = useTypingEffect(welcomeText, 40);

  const [history, setHistory] = useState<Command[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const [showMatrix, setShowMatrix] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Load saved theme on mount
  useEffect(() => {
    const savedThemeName = localStorage.getItem("terminal-theme");
    const savedTheme = savedThemeName
      ? getTheme(savedThemeName)
      : DEFAULT_THEME;

    if (savedTheme) {
      applyTheme(savedTheme);
    }
  }, []);

  const applyTheme = (theme: ThemeType) => {
    document.documentElement.style.setProperty(
      "--terminal-background",
      theme.background
    );
    document.documentElement.style.setProperty(
      "--terminal-foreground",
      theme.foreground
    );
    document.documentElement.style.setProperty(
      "--terminal-cursor",
      theme.cursor
    );
    document.documentElement.style.setProperty(
      "--terminal-selection",
      theme.selection
    );
  };

  const handleCommand = (command: string) => {
    const parts = command.toLowerCase().trim().split(" ");
    const cmd = parts[0];
    const args = parts.slice(1);
    let output: React.ReactNode;

    switch (cmd) {
      case "help":
        output = (
          <div className="space-y-1 text-sm sm:text-base">
            <p>Available commands:</p>
            <p>about - Learn about me</p>
            <p>
              skills - View my technical skills (--category
              [frontend|backend|devops])
            </p>
            <p>
              experience - View my work experience (--filter [company/type])
            </p>
            <p>projects - View my projects</p>
            <p>contact - Get in touch</p>
            <p>
              theme - Change terminal theme (--set
              [matrix|cyberpunk|retro|midnight])
            </p>
            <p>matrix - Enter the matrix</p>
            <p>game - Play snake game</p>
            <p>status - Check my availability</p>
            <p>cv - Download my resume</p>
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
      case "skills": {
        const categoryArg = args.indexOf("--category");
        const category = categoryArg !== -1 ? args[categoryArg + 1] : undefined;
        output = <Skills filter={category} />;
        break;
      }
      case "experience": {
        const filterArg = args.indexOf("--filter");
        const filter = filterArg !== -1 ? args[filterArg + 1] : undefined;
        output = <Experience filter={filter} />;
        break;
      }
      case "projects":
        output = <Projects />;
        break;
      case "contact":
        output = <Contact />;
        break;
      case "theme": {
        const setArg = args.indexOf("--set");
        const themeName = setArg !== -1 ? args[setArg + 1] : undefined;

        if (args.length > 0 && setArg === -1) {
          output = "Invalid argument. Usage: theme --set [theme_name]";
          break;
        }

        output = <Theme selectedTheme={themeName} onThemeChange={applyTheme} />;
        break;
      }
      case "matrix":
        setShowMatrix(true);
        output = "Entering the Matrix... Press ESC to exit";
        break;
      case "game": {
        output = (
          <SnakeGame
            onClose={() =>
              setHistory((prev) => [...prev, { input: "clear", output: null }])
            }
          />
        );
        break;
      }
      case "cv":
        const cvUrl = "/YourName_CV.pdf"; // Update with your CV path
        window.open(cvUrl, "_blank");
        output = "Downloading CV...";
        break;
      case "status":
        output = <Status />;
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

    // Get filtered suggestions
    const suggestions = AVAILABLE_COMMANDS.filter((cmd) =>
      cmd.toLowerCase().startsWith(input.toLowerCase())
    );

    // Handle Tab completion
    if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[selectedSuggestionIndex]);
        setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      }
      return;
    }

    // Handle arrow keys for suggestions
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestionIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setSelectedSuggestionIndex((prev) => (prev + 1) % suggestions.length);
      }
      return;
    }

    // Reset suggestion index when typing
    if (e.key.length === 1) {
      setSelectedSuggestionIndex(0);
    }
  };

  const handleSuggestionSelect = (command: string) => {
    setInput(command);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

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

  useEffect(() => {
    setIsTyping(!isComplete);
  }, [isComplete]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (inputRef.current && !isTyping) {
      inputRef.current.focus();
    }
  }, [history, isTyping]);

  return (
    <>
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
                  <span className="terminal-prompt text-sm sm:text-base">
                    $
                  </span>
                  <span className="ml-2 text-sm sm:text-base">
                    {entry.input}
                  </span>
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
                containerRef={containerRef}
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
      {showMatrix && <Matrix onStop={() => setShowMatrix(false)} />}
    </>
  );
};

export default Terminal;
