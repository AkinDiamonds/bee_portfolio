"use client";

import { RefObject } from "react";
import ReactMarkdown from "react-markdown";
import { ChatMessage } from "./useAgentChat";
import styles from "./AgentChatModal.module.css";

interface AgentMessageThreadProps {
  messages: ChatMessage[];
  agentStatus: string | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}

export function AgentMessageThread({
  messages,
  agentStatus,
  messagesEndRef,
}: AgentMessageThreadProps) {
  return (
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
  );
}
