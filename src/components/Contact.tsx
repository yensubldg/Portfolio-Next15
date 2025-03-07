"use client";

import React, { useState } from "react";
import { useTypingEffect } from "../hooks/useTypingEffect";

export const Contact: React.FC = () => {
  const [step, setStep] = useState<"name" | "email" | "message" | "complete">(
    "name"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [currentInput, setCurrentInput] = useState("");

  const prompts = {
    name: "Please enter your name:",
    email: "Enter your email address:",
    message: "Type your message:",
  };

  const introText =
    "Initializing contact form...\n\nLet's get in touch! Please follow the prompts below:";
  const { displayedText, isComplete } = useTypingEffect(introText, 30);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle Ctrl + C
    if (e.ctrlKey && e.key === "c") {
      e.preventDefault();
      setCurrentInput("");
      setStep("complete");
      setFormData({
        name: "^C (Cancelled by user)",
        email: "",
        message: "",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (currentInput.trim() === "") return;

    switch (step) {
      case "name":
        setFormData((prev) => ({ ...prev, name: currentInput }));
        setStep("email");
        break;
      case "email":
        setFormData((prev) => ({ ...prev, email: currentInput }));
        setStep("message");
        break;
      case "message":
        setFormData((prev) => ({ ...prev, message: currentInput }));
        setStep("complete");
        break;
    }

    setCurrentInput("");
  };

  const renderPrompt = () => {
    if (!isComplete) return null;

    if (step === "complete") {
      return (
        <div className="space-y-2 mt-4 animate-fade-in">
          {formData.name === "^C (Cancelled by user)" ? (
            <div className="text-yellow-400">
              Form input cancelled by user (Ctrl+C)
            </div>
          ) : (
            <>
              <div className="text-green-400">Message received! Summary:</div>
              <div className="pl-4">
                <div>Name: {formData.name}</div>
                <div>Email: {formData.email}</div>
                <div>Message: {formData.message}</div>
              </div>
              <div className="mt-4 text-terminal-foreground">
                Thanks for reaching out! I&apos;ll get back to you soon.
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="mt-4 animate-fade-in">
        <div className="terminal-line">
          <span className="terminal-prompt">$</span>
          <span className="ml-2">{prompts[step]}</span>
        </div>
        <div className="terminal-line mt-2">
          <span className="terminal-prompt">→</span>
          <input
            type={step === "email" ? "email" : "text"}
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="terminal-input ml-2 flex-1"
            autoFocus
            required
          />
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-2">
      <div className="whitespace-pre-line min-h-[80px]">
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </div>
      {renderPrompt()}
    </div>
  );
};

export default Contact;
