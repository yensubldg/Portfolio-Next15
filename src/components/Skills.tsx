"use client";

import React from "react";

interface Skill {
  name: string;
  level: number;
  category: string;
}

const skills: Skill[] = [
  // Frontend
  { name: "React/Next.js", level: 90, category: "Frontend" },
  { name: "TypeScript", level: 85, category: "Frontend" },
  { name: "TailwindCSS", level: 88, category: "Frontend" },
  { name: "HTML/CSS", level: 95, category: "Frontend" },

  // Backend
  { name: "Node.js", level: 85, category: "Backend" },
  { name: "Python", level: 80, category: "Backend" },
  { name: "SQL", level: 75, category: "Backend" },
  { name: "MongoDB", level: 78, category: "Backend" },

  // DevOps
  { name: "Docker", level: 70, category: "DevOps" },
  { name: "AWS", level: 65, category: "DevOps" },
  { name: "CI/CD", level: 72, category: "DevOps" },
];

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => {
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    // Start animation after component mount
    requestAnimationFrame(() => {
      setWidth(0);
      requestAnimationFrame(() => {
        setWidth(skill.level);
      });
    });
  }, [skill.level]);

  return (
    <div className="group space-y-1 py-1">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium group-hover:text-terminal-foreground/90 transition-colors">
          {skill.name}
        </span>
        <span className="tabular-nums group-hover:text-terminal-foreground/90 transition-colors">
          {skill.level}%
        </span>
      </div>
      <div className="relative h-2 bg-terminal-foreground/10 rounded-full overflow-hidden shadow-inner">
        <div
          className={`
            absolute top-0 left-0 h-full
            bg-terminal-foreground
            transition-[width,filter,box-shadow]
            duration-1000 ease-out
            rounded-full
            group-hover:brightness-110
            group-hover:shadow-glow
          `}
          style={{
            width: `${width}%`,
            boxShadow: "0 0 8px var(--terminal-foreground)",
            transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      </div>
    </div>
  );
};

interface SkillsProps {
  filter?: string;
}

export const Skills: React.FC<SkillsProps> = ({ filter }) => {
  // Get filtered or all categories
  const filteredCategories = filter
    ? [filter.charAt(0).toUpperCase() + filter.slice(1).toLowerCase()]
    : Array.from(new Set(skills.map((s) => s.category)));

  // Check if the filter is valid
  if (filter && !filteredCategories[0]) {
    return (
      <div className="text-red-400">
        Invalid category. Available categories: frontend, backend, devops
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {filteredCategories.map((category) => (
        <div key={category} className="space-y-3">
          <h3 className="font-bold text-lg border-b border-terminal-foreground/20 pb-1">
            {category}
          </h3>
          <div className="space-y-3">
            {skills
              .filter((skill) => skill.category === category)
              .map((skill) => (
                <SkillBar key={skill.name} skill={skill} />
              ))}
          </div>
        </div>
      ))}
      <div className="text-sm opacity-70 mt-4">
        Use &quot;skills --category [frontend|backend|devops]&quot; to filter
        skills
      </div>
    </div>
  );
};

export default Skills;
