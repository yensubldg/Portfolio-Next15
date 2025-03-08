export type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";
export type Position = { x: number; y: number };

export const GRID_SIZE = 20;
export const CELL_SIZE = 20;
export const INITIAL_SNAKE: Position[] = [{ x: 10, y: 10 }];
export const INITIAL_DIRECTION = "RIGHT";
export const GAME_SPEED = 100;

// Game utilities
export const generateRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

export const generateFood = (currentSnake: Position[]): Position => {
  const newFood = generateRandomPosition();
  return currentSnake.some(
    (segment) => segment.x === newFood.x && segment.y === newFood.y
  )
    ? generateFood(currentSnake)
    : newFood;
};

export const checkCollision = (pos: Position, snake: Position[]): boolean => {
  // Wall collision
  if (pos.x < 0 || pos.x >= GRID_SIZE || pos.y < 0 || pos.y >= GRID_SIZE) {
    return true;
  }
  // Self collision (skip head)
  return snake
    .slice(1)
    .some((segment) => segment.x === pos.x && segment.y === pos.y);
};

export const moveSnake = (
  snake: Position[],
  direction: Direction
): Position => {
  const head = { ...snake[0] };
  switch (direction) {
    case "UP":
      head.y -= 1;
      break;
    case "DOWN":
      head.y += 1;
      break;
    case "LEFT":
      head.x -= 1;
      break;
    case "RIGHT":
      head.x += 1;
      break;
  }
  return head;
};
