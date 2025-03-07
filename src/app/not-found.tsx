"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DiagnosticLoader from "~/components/DiagnosticLoader";

export default function NotFound() {
  const router = useRouter();
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const lines = [
    "Error: 404 Not Found",
    "Process terminated unexpectedly.",
    "Location: Unknown directory",
    "",
    "Possible solutions:",
    "1. Check the URL for typos",
    "2. Navigate back to home (cd /)",
    "3. Try a different path",
    "",
  ];

  useEffect(() => {
    let currentIndex = 0;
    const lineInterval = setInterval(() => {
      if (currentIndex < lines.length) {
        setDisplayedLines((prev) => [...prev, lines[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(lineInterval);
        setShowDiagnostic(true);

        // Show prompt after diagnostic
        setTimeout(() => {
          setShowPrompt(true);
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 6000);
      }
    }, 100);

    return () => clearInterval(lineInterval);
  }, []);

  const handleCommand = (cmd: string) => {
    if (cmd.trim().toLowerCase() === "cd /") {
      // Navigate home
      router.push("/");
    } else {
      setDisplayedLines((prev) => [
        ...prev,
        `Command not found: ${cmd}. Try 'cd /' to return home.`,
      ]);
    }
    setInput("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    handleCommand(input);
  };

  return (
    <div className="fixed inset-0 bg-terminal-background">
      <div className="terminal-window border-none sm:border-solid">
        <div className="terminal-header">
          <div className="terminal-dot bg-red-500"></div>
          <div className="terminal-dot bg-yellow-500"></div>
          <div className="terminal-dot bg-green-500"></div>
        </div>

        <div className="terminal-content p-2 sm:p-4 font-mono text-terminal-foreground">
          {displayedLines.map((line, index) => (
            <div
              key={index}
              className="whitespace-pre-line mb-1 sm:mb-2 text-sm sm:text-base"
            >
              {line}
            </div>
          ))}

          {showDiagnostic && (
            <div className="animate-fade-in mt-2">
              <DiagnosticLoader />
            </div>
          )}

          {showPrompt && (
            <div className="mt-2 sm:mt-4 animate-fade-in">
              <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <span className="terminal-prompt text-sm sm:text-base">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="terminal-input flex-1 bg-transparent border-none outline-none text-sm sm:text-base"
                  autoFocus
                  spellCheck={false}
                  autoComplete="off"
                  placeholder="cd /"
                />
              </form>
              <div className="animate-pulse ml-4 mt-1">_</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
