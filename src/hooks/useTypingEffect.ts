import { useState, useEffect } from "react";

export const useTypingEffect = (text: string, speed: number = 30) => {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let currentIndex = 0;
    let mounted = true;

    // Reset states when text changes
    setDisplayedText("");
    setIsComplete(false);

    const type = () => {
      if (!mounted || currentIndex >= text.length) return;

      setDisplayedText(text.slice(0, currentIndex + 1));
      currentIndex++;

      if (currentIndex === text.length) {
        setIsComplete(true);
      }
    };

    // Initial delay before starting to type
    const initialTimeout = setTimeout(() => {
      const interval = setInterval(type, speed);
      return () => clearInterval(interval);
    }, 200);

    return () => {
      mounted = false;
      clearTimeout(initialTimeout);
    };
  }, [text, speed]);

  return { displayedText, isComplete };
};

export default useTypingEffect;
