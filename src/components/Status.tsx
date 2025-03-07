"use client";

import React from "react";

export const Status: React.FC = () => {
  const status = {
    openToWork: false,
    preferredRoles: [
      "Full Stack Developer",
      "Frontend Developer",
      "Backend Developer",
    ],
    location: "Remote / Da Nang, Vietnam",
    availability: "Available for full-time opportunities",
    lastUpdated: "2025-03-07",
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status.openToWork ? "bg-green-400 animate-pulse" : "bg-red-400"
          }`}
        />
        <span className="font-bold">
          {status.openToWork ? "Open to Work" : "Not Currently Available"}
        </span>
      </div>

      <div className="space-y-2 pl-5">
        <div>
          <span className="opacity-70">Preferred Roles:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {status.preferredRoles.map((role, i) => (
              <span
                key={i}
                className="text-sm px-2 py-1 rounded-full 
                  border border-terminal-foreground/30
                  bg-terminal-foreground/10"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <div>
          <span className="opacity-70">Location:</span>
          <span className="ml-2">{status.location}</span>
        </div>

        <div>
          <span className="opacity-70">Availability:</span>
          <span className="ml-2">{status.availability}</span>
        </div>

        <div className="text-sm opacity-60 mt-4">
          Last updated: {status.lastUpdated}
        </div>
      </div>
    </div>
  );
};

export default Status;
