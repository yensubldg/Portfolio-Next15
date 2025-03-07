"use client";

import React, { useEffect, useRef } from "react";

export const Matrix: React.FC<{ onStop?: () => void }> = ({ onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get terminal theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const terminalForeground = computedStyle
      .getPropertyValue("--terminal-foreground")
      .trim();
    const terminalBackground = computedStyle
      .getPropertyValue("--terminal-background")
      .trim();

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();

    // Matrix characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");

    // Set up the columns
    const fontSize = 16;
    const columns = canvas.width / fontSize;
    const drops: number[] = [];

    // Initialize drops
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    let animationFrameId: number;
    let active = true;

    const draw = () => {
      if (!ctx) return;

      // Semi-transparent black background for trail effect
      ctx.fillStyle = `${terminalBackground}0D`; // Add alpha for trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set text properties
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Calculate color based on terminal theme
        const alpha = Math.random();
        ctx.fillStyle = terminalForeground.startsWith("#")
          ? `${terminalForeground}${Math.floor(alpha * 255)
              .toString(16)
              .padStart(2, "0")}`
          : terminalForeground;

        // Draw character
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reset when off screen
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop
        drops[i]++;
      }

      if (active) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    // Handle window resize
    window.addEventListener("resize", updateSize);

    // Handle escape key to stop animation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        active = false;
        cancelAnimationFrame(animationFrameId);
        onStop?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Start animation
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", updateSize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onStop]);

  return (
    <div className="fixed inset-0 z-50">
      <canvas ref={canvasRef} className="bg-terminal-background" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-terminal-foreground text-sm">
        Press ESC to exit Matrix
      </div>
    </div>
  );
};

export default Matrix;
