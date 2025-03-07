"use client";

import React from "react";

interface Experience {
  title: string;
  company: string;
  period: string;
  description: string[];
  tech: string[];
  type: string;
}

const experiences: Experience[] = [
  {
    title: "Research Engineer",
    company: "LG Electronics R&D Vietnam - Da Nang Branch",
    period: "2023 - Present",
    type: "fulltime",
    description: [
      "Developing web applications for internal use",
      "Researching and implementing new technologies",
    ],
    tech: ["React", "Node.js", "AWS", "TypeScript", "Python"],
  },
];

interface ExperienceProps {
  filter?: string; // company name or type
}

export const Experience: React.FC<ExperienceProps> = ({ filter }) => {
  const filteredExperience = filter
    ? experiences.filter(
        (exp) =>
          exp.company.toLowerCase().includes(filter.toLowerCase()) ||
          exp.type.toLowerCase() === filter.toLowerCase()
      )
    : experiences;

  if (filter && filteredExperience.length === 0) {
    return (
      <div className="text-red-400">
        No experience found for: {filter}
        <br />
        Try searching by company name or type (fulltime/contract)
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {filteredExperience.map((exp, index) => (
        <div
          key={index}
          className="relative pl-6 pb-6 last:pb-0 border-l border-terminal-foreground/20"
        >
          {/* Timeline dot */}
          <div
            className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-terminal-foreground"
            style={{
              boxShadow: "0 0 10px var(--terminal-foreground)",
            }}
          />

          {/* Content */}
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold">{exp.title}</h3>
                <div className="text-sm opacity-80">
                  {exp.company}
                  <span className="ml-2 opacity-60">({exp.type})</span>
                </div>
              </div>
              <div className="text-sm opacity-70">{exp.period}</div>
            </div>

            <ul className="list-disc list-inside space-y-1 opacity-90">
              {exp.description.map((desc, i) => (
                <li key={i} className="text-sm">
                  {desc}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-2 pt-1">
              {exp.tech.map((tech, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-1 rounded-full 
                    border border-terminal-foreground/30
                    bg-terminal-foreground/10"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ))}

      <div className="text-sm opacity-70 mt-4">
        Use &quot;experience --filter [company/type]&quot; to filter experience
      </div>
    </div>
  );
};

export default Experience;
