"use client";

import React, { useEffect, useState } from "react";

export const DiagnosticLoader: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(0);
  const [loadingDots, setLoadingDots] = useState("");
  const [glowOpacity, setGlowOpacity] = useState(0.2);

  // Loading dots animation
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setLoadingDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Glow animation
  useEffect(() => {
    const glowInterval = setInterval(() => {
      setGlowOpacity((prev) => (prev === 0.2 ? 0.4 : 0.2));
    }, 1000);

    return () => clearInterval(glowInterval);
  }, []);

  // Progress animation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = Math.random() * 3 + 1;
        return Math.min(prev + increment, 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Phase updates
  useEffect(() => {
    if (progress >= 25 && phase < 1) setPhase(1);
    if (progress >= 50 && phase < 2) setPhase(2);
    if (progress >= 75 && phase < 3) setPhase(3);
    if (progress >= 100 && phase < 4) setPhase(4);
  }, [progress, phase]);

  const getProgressBar = () => {
    const totalWidth =
      typeof window !== "undefined" && window.innerWidth < 640 ? 8 : 13;
    const filledCount = Math.floor((progress / 100) * totalWidth);
    const filled = "=".repeat(filledCount);
    const empty = " ".repeat(totalWidth - filledCount);
    return `[${filled}${empty}]`;
  };

  return (
    <div className="space-y-2 font-mono relative">
      <div
        className="absolute inset-0 bg-terminal-foreground opacity-5 blur-xl"
        style={{ opacity: glowOpacity }}
      ></div>

      <div className="relative">
        <div className="text-sm sm:text-base animate-fade-in">
          Running diagnostic{loadingDots}
        </div>
        <div className="font-mono text-terminal-foreground whitespace-pre text-sm sm:text-base">
          {getProgressBar()} {Math.floor(progress)}%
        </div>
      </div>

      <div className="space-y-1 relative">
        {phase >= 1 && (
          <div className="text-yellow-400 animate-fade-in opacity-90">
            Checking filesystem{loadingDots}
          </div>
        )}
        {phase >= 2 && (
          <div className="text-yellow-400 animate-fade-in opacity-90">
            Analyzing routes{loadingDots}
          </div>
        )}
        {phase >= 3 && (
          <div className="text-yellow-400 animate-fade-in opacity-90">
            Verifying endpoints{loadingDots}
          </div>
        )}
        {phase >= 4 && (
          <div
            className="text-green-400 mt-4 animate-fade-in font-bold"
            style={{ textShadow: "0 0 10px rgba(0, 255, 0, 0.3)" }}
          >
            Diagnostic complete. Navigation recommended.
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticLoader;
