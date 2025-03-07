"use client";

import React, { useEffect, useRef } from "react";

export const Matrix: React.FC<{ onStop?: () => void }> = ({ onStop }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Matrix characters
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0F0";
      ctx.font = `${fontSize}px monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = chars[Math.floor(Math.random() * chars.length)];

        // Draw character
        ctx.fillStyle = `rgba(0, 255, 0, ${Math.random()})`;
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
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    animationFrameId = requestAnimationFrame(draw);

    // Handle escape key to stop animation
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        active = false;
        cancelAnimationFrame(animationFrameId);
        onStop?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onStop]);

  return (
    <div className="fixed inset-0 z-50">
      <canvas ref={canvasRef} className="bg-black" />
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-green-400 text-sm">
        Press ESC to exit Matrix
      </div>
    </div>
  );
};

export default Matrix;
