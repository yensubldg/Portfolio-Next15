"use client";

import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex justify-center items-center gap-4 p-4 bg-terminal-background/80 backdrop-blur z-50 border-t border-terminal-foreground/20">
      <a
        href="https://github.com/yensubldg"
        target="_blank"
        rel="noopener noreferrer"
        className="text-terminal-foreground/70 hover:text-terminal-foreground transition-colors duration-200 hover:scale-110 transform"
        aria-label="GitHub Profile"
      >
        <FontAwesomeIcon icon={faGithub} className="w-5 h-5" />
      </a>
      <a
        href="mailto:windev.thang@gmail.com"
        className="text-terminal-foreground/70 hover:text-terminal-foreground transition-colors duration-200 hover:scale-110 transform"
        aria-label="Email Contact"
      >
        <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5" />
      </a>
    </footer>
  );
};

export default Footer;
