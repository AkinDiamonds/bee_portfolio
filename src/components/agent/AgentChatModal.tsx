"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import styles from "./AgentChatModal.module.css";

interface AgentChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STARTER_PROMPTS = [
  "What is Simeon's latest project?",
  "Leave this message for Simeon from me",
  "Why should I hire Simeon for my project?",
];

export default function AgentChatModal({ isOpen, onClose }: AgentChatModalProps) {
  const [inputValue, setInputValue] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    inputRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled])',
      );
      if (!focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio agent"
        className={styles.dialog}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close agent">
          <X aria-hidden="true" />
        </button>

        <div className={styles.prompts} aria-label="Suggested prompts">
          {STARTER_PROMPTS.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className={styles.prompt}
              onClick={() => setInputValue(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>

        <form className={styles.form} onSubmit={(event) => event.preventDefault()}>
          <label className={styles.visuallyHidden} htmlFor="agent-message">
            Message for Simeon
          </label>
          <input
            ref={inputRef}
            id="agent-message"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="Write a message"
            autoComplete="off"
          />
          <button type="submit" className={styles.sendButton} aria-label="Send message">
            <ArrowUp aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
