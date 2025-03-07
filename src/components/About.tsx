"use client";

import React from "react";
import { useTypingEffect } from "../hooks/useTypingEffect";

export const About: React.FC = () => {
  const aboutText = `Hi there! 👋\n
I'm a Full Stack Developer passionate about building innovative web solutions.\n
🚀 Technical Skills:
- Frontend: React, Next.js, TypeScript, TailwindCSS
- Backend: Node.js, Python, SQL, MongoDB
- DevOps: Docker, AWS, CI/CD\n
💡 I love solving complex problems and creating elegant user experiences.\n
Type 'projects' to see my work or 'contact' to get in touch!`;

  const { displayedText, isComplete } = useTypingEffect(aboutText, 30);

  return (
    <div className="space-y-2">
      <div className="whitespace-pre-line min-h-[200px]">
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </div>
    </div>
  );
};

export default About;
