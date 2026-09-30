"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import styles from "./AgentChatModal.module.css";
import { useAgentChat } from "./useAgentChat";
import { AgentMessageThread } from "./AgentMessageThread";

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
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isGenerating, agentStatus, sendMessage, resetChat } = useAgentChat();

  const handleSend = (content: string) => {
    if (!content.trim() || isGenerating) return;
    sendMessage(content);
    setInputValue("");
    setShowConfirmReset(false);
  };

  useEffect(() => {
    if (!isOpen) {
      setShowConfirmReset(false);
      return;
    }
    const timeout = setTimeout(() => inputRef.current?.focus(), 50);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (showConfirmReset) setShowConfirmReset(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose, showConfirmReset]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, agentStatus]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onMouseDown={onClose}>
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Portfolio agent"
        data-agent-dialog="true"
        className={styles.dialog}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Chat with my Agent</h2>
          <div className={styles.headerActions}>
            {messages.length > 0 && (
              <button
                type="button"
                className={styles.headerButton}
                onClick={() => setShowConfirmReset(true)}
                aria-label="Start new conversation"
                title="Start new conversation"
                disabled={isGenerating}
              >
                <RotateCcw aria-hidden="true" />
              </button>
            )}
            <button type="button" className={styles.headerButton} onClick={onClose} aria-label="Close agent">
              <X aria-hidden="true" />
            </button>
          </div>
        </div>

        {showConfirmReset && (
          <div className={styles.confirmBanner} role="alert">
            <p className={styles.confirmMessage}>
              Start a new conversation? Your current chat history will be lost.
            </p>
            <div className={styles.confirmActions}>
              <button
                type="button"
                className={styles.confirmButtonCancel}
                onClick={() => setShowConfirmReset(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.confirmButtonConfirm}
                onClick={() => {
                  resetChat();
                  setShowConfirmReset(false);
                }}
              >
                Start new
              </button>
            </div>
          </div>
        )}

        {messages.length === 0 ? (
          <div className={styles.prompts} aria-label="Suggested prompts">
            {STARTER_PROMPTS.map((prompt) => (
              <button key={prompt} type="button" className={styles.prompt} onClick={() => handleSend(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          <AgentMessageThread
            messages={messages}
            agentStatus={agentStatus}
            messagesEndRef={messagesEndRef}
          />
        )}

        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(inputValue);
          }}
        >
          <label className={styles.visuallyHidden} htmlFor="agent-message">
            Message for Simeon
          </label>
          <input
            ref={inputRef}
            id="agent-message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={isGenerating ? "Agent is typing..." : "Write a message"}
            autoComplete="off"
            disabled={isGenerating}
          />
          <button
            type="submit"
            className={styles.sendButton}
            aria-label="Send message"
            disabled={!inputValue.trim() || isGenerating}
          >
            <ArrowUp aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}
