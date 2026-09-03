"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import CatRiveCanvas from "./CatRiveCanvas";
import AgentChatModal from "./AgentChatModal";

const emptySubscribe = () => () => {};

export default function PortfolioAgent() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dragBounds, setDragBounds] = useState({ top: 0, right: 0, bottom: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const wasDraggedRef = useRef(false);

  useEffect(() => {
    const updateDragBounds = () => {
      const element = triggerRef.current;
      if (!element) return;

      const bounds = element.getBoundingClientRect();
      const inset = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      setDragBounds({
        top: -(bounds.top - inset),
        right: window.innerWidth - bounds.right - inset,
        bottom: window.innerHeight - bounds.bottom - inset,
        left: -(bounds.left - inset),
      });
    };

    updateDragBounds();
    window.addEventListener("resize", updateDragBounds, { passive: true });
    return () => window.removeEventListener("resize", updateDragBounds);
  }, []);

  if (!isMounted) return null;

  const closeChat = () => {
    setIsChatOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  return (
    <>
      <motion.aside
        ref={triggerRef}
        aria-label="Cat portfolio agent"
        drag={!isChatOpen}
        dragConstraints={dragBounds}
        dragMomentum={false}
        dragElastic={0}
        onDragStart={() => { wasDraggedRef.current = true; }}
        onDragEnd={() => { window.setTimeout(() => { wasDraggedRef.current = false; }, 0); }}
        className={`fixed right-[var(--spacing-5)] z-[var(--z-agent-above-modal)] h-[var(--size-agent-mobile)] w-[var(--size-agent-mobile)] touch-none sm:right-[var(--spacing-6)] sm:h-[var(--size-agent-desktop)] sm:w-[var(--size-agent-desktop)] ${isChatOpen ? "bottom-[var(--spacing-5)] sm:bottom-[var(--spacing-6)]" : "bottom-[var(--spacing-5)] cursor-grab active:cursor-grabbing sm:bottom-[var(--spacing-6)]"}`}
      >
        <CatRiveCanvas onActivate={() => { if (!wasDraggedRef.current) setIsChatOpen(true); }} className="h-full w-full" />
      </motion.aside>
      <AgentChatModal isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
}
