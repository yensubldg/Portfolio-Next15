"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Direction,
  Position,
  GRID_SIZE,
  CELL_SIZE,
  INITIAL_SNAKE,
  INITIAL_DIRECTION,
  GAME_SPEED,
  generateFood,
  checkCollision,
  moveSnake,
} from "../types/game";

interface SnakeGameProps {
  onClose?: () => void;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Direction;
  nextDirection: Direction;
  gameOver: boolean;
  score: number;
  isPaused: boolean;
}

const initialState: GameState = {
  snake: INITIAL_SNAKE,
  food: generateFood(INITIAL_SNAKE),
  direction: INITIAL_DIRECTION,
  nextDirection: INITIAL_DIRECTION,
  gameOver: false,
  score: 0,
  isPaused: false,
};

export const SnakeGame: React.FC<SnakeGameProps> = ({ onClose }) => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(performance.now());

  // Update game state
  const updateGame = useCallback(
    (timestamp: number) => {
      if (gameState.gameOver || gameState.isPaused) return false;

      if (timestamp - lastUpdateRef.current < GAME_SPEED) return true;
      lastUpdateRef.current = timestamp;

      setGameState((prev) => {
        const head = moveSnake(prev.snake, prev.nextDirection);

        // Check collisions
        if (checkCollision(head, prev.snake)) {
          return { ...prev, gameOver: true };
        }

        const newSnake = [head, ...prev.snake];
        let newFood = prev.food;
        let newScore = prev.score;

        // Check food collision
        if (head.x === prev.food.x && head.y === prev.food.y) {
          newFood = generateFood(newSnake);
          newScore = prev.score + 1;
        } else {
          newSnake.pop();
        }

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
          direction: prev.nextDirection,
        };
      });

      return true;
    },
    [gameState.gameOver, gameState.isPaused]
  );

  // Game loop
  const gameLoop = useCallback(
    (timestamp: number) => {
      if (updateGame(timestamp)) {
        frameIdRef.current = requestAnimationFrame(gameLoop);
      }
    },
    [updateGame]
  );

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
        return;
      }

      if (gameState.gameOver) {
        if (e.key === "r") {
          setGameState(initialState);
        }
        return;
      }

      let newDirection = gameState.nextDirection;

      switch (e.key) {
        case "ArrowUp":
          if (gameState.direction !== "DOWN") newDirection = "UP";
          break;
        case "ArrowDown":
          if (gameState.direction !== "UP") newDirection = "DOWN";
          break;
        case "ArrowLeft":
          if (gameState.direction !== "RIGHT") newDirection = "LEFT";
          break;
        case "ArrowRight":
          if (gameState.direction !== "LEFT") newDirection = "RIGHT";
          break;
        case "p":
          setGameState((prev) => ({ ...prev, isPaused: !prev.isPaused }));
          return;
      }

      if (newDirection !== gameState.nextDirection) {
        setGameState((prev) => ({ ...prev, nextDirection: newDirection }));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    gameState.direction,
    gameState.nextDirection,
    gameState.gameOver,
    onClose,
  ]);

  // Render game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get theme colors
    const computedStyle = getComputedStyle(document.documentElement);
    const foreground = computedStyle
      .getPropertyValue("--terminal-foreground")
      .trim();
    const background = computedStyle
      .getPropertyValue("--terminal-background")
      .trim();

    // Clear canvas
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Draw snake
    ctx.fillStyle = foreground;
    gameState.snake.forEach((segment, index) => {
      const alpha = 1 - (index / gameState.snake.length) * 0.6;
      ctx.globalAlpha = alpha;
      ctx.fillRect(
        segment.x * CELL_SIZE,
        segment.y * CELL_SIZE,
        CELL_SIZE - 1,
        CELL_SIZE - 1
      );
      // Add glow effect to head
      if (index === 0) {
        ctx.shadowColor = foreground;
        ctx.shadowBlur = 10;
      } else {
        ctx.shadowBlur = 0;
      }
    });

    // Draw food with pulsing effect
    ctx.globalAlpha = 0.8 + Math.sin(Date.now() / 200) * 0.2;
    ctx.shadowColor = foreground;
    ctx.shadowBlur = 15;
    ctx.fillRect(
      gameState.food.x * CELL_SIZE,
      gameState.food.y * CELL_SIZE,
      CELL_SIZE - 1,
      CELL_SIZE - 1
    );
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }, [gameState.snake, gameState.food]);

  // Start game loop
  useEffect(() => {
    frameIdRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (frameIdRef.current !== null) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="flex gap-8 animate-fade-in">
      {/* Game board */}
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="border border-terminal-foreground/30 rounded shadow-glow"
      />

      {/* Game info */}
      <div className="space-y-8">
        <div className="space-y-2 text-lg">
          <div className="flex items-baseline gap-2">
            <span className="opacity-70">Score:</span>
            <span className="font-bold text-xl text-terminal-foreground">
              {gameState.score}
            </span>
          </div>
          {gameState.gameOver && (
            <div className="text-red-400 animate-pulse">
              Game Over! Press R to restart
            </div>
          )}
          {gameState.isPaused && (
            <div className="text-terminal-foreground/70">
              Paused - Press P to resume
            </div>
          )}
        </div>

        <div className="space-y-1 text-sm opacity-70">
          <div>Controls:</div>
          <div>↑↓←→ - Move snake</div>
          <div>P - Pause game</div>
          <div>R - Restart game</div>
          <div>ESC - Exit game</div>
        </div>
      </div>
    </div>
  );
};

export default SnakeGame;
