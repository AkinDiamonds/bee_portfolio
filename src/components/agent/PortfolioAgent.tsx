"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimationControls } from "framer-motion";
import CatRiveCanvas from "./CatRiveCanvas";
import AgentChatModal from "./AgentChatModal";

const emptySubscribe = () => () => {};

export default function PortfolioAgent() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const isInitialMountRef = useRef(true);
  const controls = useAnimationControls();

  useLayoutEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }

    if (!isChatOpen) {
      controls.start({
        x: 0,
        y: 0,
        transition: { duration: 0.32, ease: [0.2, 0, 0, 1] },
      });
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      const cat = triggerRef.current;
      const dialog = document.querySelector<HTMLElement>("[data-agent-dialog]");
      if (!cat || !dialog) return;

      const catBounds = cat.getBoundingClientRect();
      const dialogBounds = dialog.getBoundingClientRect();
      const targetCenterX = dialogBounds.left + dialogBounds.width / 2;
      const targetTop = dialogBounds.top - catBounds.height / 2;
      const deltaX = targetCenterX - (catBounds.left + catBounds.width / 2);
      const deltaY = targetTop - catBounds.top;

      controls.start({
        x: deltaX,
        y: deltaY,
        transition: { duration: 0.32, ease: [0.2, 0, 0, 1] },
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [controls, isChatOpen]);

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
        style={{ zIndex: 9999 }}
        animate={controls}
        className="fixed bottom-[var(--spacing-5)] right-[var(--spacing-5)] h-[var(--size-agent-mobile)] w-[var(--size-agent-mobile)] select-none sm:bottom-[var(--spacing-6)] sm:right-[var(--spacing-6)] sm:h-[var(--size-agent-desktop)] sm:w-[var(--size-agent-desktop)]"
      >
        <CatRiveCanvas onActivate={() => setIsChatOpen(true)} className="h-full w-full" />
      </motion.aside>
      <AgentChatModal isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
}
