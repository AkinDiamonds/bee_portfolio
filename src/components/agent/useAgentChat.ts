import { useState, useRef, useCallback, useEffect } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
  role: MessageRole;
  content: string;
}

const CAT_LOADING_MESSAGES = [
  "purring...",
  "stretching...",
  "nonchalanting...",
  "searching...",
  "thinking...",
  "peeping...",
  "staring...",
  "proactiving...",
  "cleaning paws...",
  "meowing...",
];

const CAT_ERROR_MESSAGE = "Something went wrong on my end. I'm probably just taking a nap. Try again later!";

export function useAgentChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentStatus, setAgentStatus] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const setRandomCatStatus = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * CAT_LOADING_MESSAGES.length);
    setAgentStatus(CAT_LOADING_MESSAGES[randomIndex]);
  }, []);

  const resetChat = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setMessages([]);
    setIsGenerating(false);
    setAgentStatus(null);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isGenerating) return;

    // Abort any ongoing stream
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const newController = new AbortController();
    abortControllerRef.current = newController;

    // Snapshot history before appending new user message
    const historySnapshot = messages.filter((m) => m.content.trim().length > 0);

    const userMessage: ChatMessage = { role: "user", content: trimmed };
    const initialAssistantMessage: ChatMessage = { role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMessage, initialAssistantMessage]);
    setIsGenerating(true);
    setRandomCatStatus();

    const baseUrl = process.env.NEXT_PUBLIC_AGENT_URL || "http://localhost:8000";

    try {
      await fetchEventSource(`${baseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: trimmed, 
          history: historySnapshot,
        }),
        signal: newController.signal,
        onmessage(ev) {
          try {
            const data = JSON.parse(ev.data);
            if (ev.event === "token") {
              setAgentStatus(null);
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx] = {
                  ...newMessages[lastIdx],
                  content: newMessages[lastIdx].content + data.text,
                };
                return newMessages;
              });
            } else if (ev.event === "status") {
              setAgentStatus(data.message);
            } else if (ev.event === "done") {
              setIsGenerating(false);
              setAgentStatus(null);
            } else if (ev.event === "error") {
              const errorMsg = data.message || CAT_ERROR_MESSAGE;
              setMessages((prev) => {
                const newMessages = [...prev];
                const lastIdx = newMessages.length - 1;
                newMessages[lastIdx] = {
                  ...newMessages[lastIdx],
                  content: newMessages[lastIdx].content.length > 0
                    ? `${newMessages[lastIdx].content}\n\n${errorMsg}`
                    : errorMsg,
                };
                return newMessages;
              });
              setIsGenerating(false);
              setAgentStatus(null);
              newController.abort();
            }
          } catch (err) {
            console.error("Error parsing event payload:", err);
          }
        },
        onerror(err) {
          if (!newController.signal.aborted) {
            setMessages((prev) => {
              const newMessages = [...prev];
              const lastIdx = newMessages.length - 1;
              newMessages[lastIdx] = {
                ...newMessages[lastIdx],
                content: newMessages[lastIdx].content.length > 0 
                  ? `${newMessages[lastIdx].content}\n\n${CAT_ERROR_MESSAGE}`
                  : CAT_ERROR_MESSAGE,
              };
              return newMessages;
            });
            setIsGenerating(false);
            setAgentStatus(null);
          }
          throw err; // Stop fetch-event-source retrying
        },
      });
    } catch (err) {
      if (!(err instanceof Error && err.name === "AbortError") && !newController.signal.aborted) {
        console.error("Chat error:", err);
      }
      setIsGenerating(false);
      setAgentStatus(null);
    }
  }, [isGenerating, messages, setRandomCatStatus]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isGenerating,
    agentStatus,
    sendMessage,
    resetChat,
  };
}
