export interface ThemeType {
  name: string;
  background: string;
  foreground: string;
  cursor: string;
  selection: string;
  description: string;
}

export const THEMES: ThemeType[] = [
  {
    name: "matrix",
    background: "#0a0a0a",
    foreground: "#00ff00",
    cursor: "#00ff00",
    selection: "rgba(0, 255, 0, 0.3)",
    description: "Classic Matrix theme",
  },
  {
    name: "cyberpunk",
    background: "#2b213a",
    foreground: "#ff2a6d",
    cursor: "#05d9e8",
    selection: "rgba(255, 42, 109, 0.3)",
    description: "Neon Cyberpunk vibes",
  },
  {
    name: "retro",
    background: "#2d2d2d",
    foreground: "#ff8f00",
    cursor: "#ffb74d",
    selection: "rgba(255, 143, 0, 0.3)",
    description: "Vintage terminal feel",
  },
  {
    name: "midnight",
    background: "#1a1b26",
    foreground: "#7aa2f7",
    cursor: "#bb9af7",
    selection: "rgba(122, 162, 247, 0.3)",
    description: "Tokyo Night inspired",
  },
];

export const DEFAULT_THEME = THEMES[0];

export function getTheme(name: string): ThemeType | undefined {
  return THEMES.find((t) => t.name.toLowerCase() === name.toLowerCase());
}
