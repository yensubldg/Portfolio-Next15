"use client";

import React from "react";
import { useTypingEffect } from "../hooks/useTypingEffect";

interface Project {
  name: string;
  description: string;
  tech: string[];
  link: string;
}

const projects: Project[] = [
  {
    name: "Portfolio Website",
    description:
      "Personal portfolio website built with Next.js and Tailwind CSS",
    tech: ["Next.js", "Tailwind CSS", "TypeScript"],
    link: "https://github.com/yensubldg/Portfolio-Next15",
  },
  {
    name: "AI Assistant App",
    description: "Voice Assistant for Visually Impaired People on Windows",
    tech: ["Python", "Electronjs", "SpeechRecognition", "Intent Recognition"],
    link: "https://github.com/Beacon-Voice-Assistant",
  },
];

export const Projects: React.FC = () => {
  const introText =
    "Loading project directory...\n\nHere are some of my recent projects:";
  const { displayedText, isComplete } = useTypingEffect(introText, 30);

  return (
    <div className="space-y-4">
      <div className="whitespace-pre-line min-h-[60px]">
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </div>

      {isComplete && (
        <div className="space-y-6 animate-fade-in">
          {projects.map((project, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-terminal-foreground">→</span>
                <span className="font-bold">{project.name}</span>
              </div>
              <div className="pl-4 opacity-90">{project.description}</div>
              <div className="pl-4 text-sm opacity-80">
                Tech: {project.tech.join(" · ")}
              </div>
              <div className="pl-4 text-sm">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-foreground hover:underline"
                >
                  {project.link}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
