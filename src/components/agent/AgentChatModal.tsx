"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import styles from "./AgentChatModal.module.css";
import { useAgentChat } from "./useAgentChat";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, isGenerating, agentStatus, sendMessage } = useAgentChat();

  const handleSend = (content: string) => {
    if (!content.trim() || isGenerating) return;
    sendMessage(content);
    setInputValue("");
  };

  useEffect(() => {
    if (!isOpen) return;
    
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
    
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
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>Chat with my Agent</h2>
          <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close agent">
            <X aria-hidden="true" />
          </button>
        </div>

        {messages.length === 0 ? (
          <div className={styles.prompts} aria-label="Suggested prompts">
            {STARTER_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className={styles.prompt}
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
        ) : (
          <div className={styles.messageThread}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.messageBubble} ${
                  msg.role === "user" ? styles.messageUser : styles.messageAssistant
                }`}
              >
                {msg.role === "assistant" ? (
                  <div className={styles.markdown}>
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer">
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  msg.content
                )}
              </div>
            ))}
            
            {agentStatus && (
              <div className={`${styles.messageBubble} ${styles.messageAssistant} ${styles.messageLoading}`}>
                <span className={styles.loadingPulse} />
                {agentStatus}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}

        <form 
          className={styles.form} 
          onSubmit={(event) => {
            event.preventDefault();
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
            onChange={(event) => setInputValue(event.target.value)}
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
