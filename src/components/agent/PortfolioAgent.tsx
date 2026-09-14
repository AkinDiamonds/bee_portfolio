"use client";

import { useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useAnimationControls, useMotionValue } from "framer-motion";
import CatRiveCanvas from "./CatRiveCanvas";
import AgentChatModal from "./AgentChatModal";

const emptySubscribe = () => () => {};
type DragBounds = { top: number; right: number; bottom: number; left: number };
type Position = { x: number; y: number };

export default function PortfolioAgent() {
  const isMounted = useSyncExternalStore(emptySubscribe, () => true, () => false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dragBounds, setDragBounds] = useState<DragBounds | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const wasDraggedRef = useRef(false);
  const positionBeforeChatRef = useRef<Position>({ x: 0, y: 0 });
  const controls = useAnimationControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useLayoutEffect(() => {
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
    const element = triggerRef.current;
    const observer = element ? new ResizeObserver(updateDragBounds) : null;
    observer?.observe(document.documentElement);
    window.addEventListener("resize", updateDragBounds, { passive: true });
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateDragBounds);
    };
  }, []);

  useLayoutEffect(() => {
    if (!isChatOpen) {
      controls.start({
        x: positionBeforeChatRef.current.x,
        y: positionBeforeChatRef.current.y,
        transition: { duration: 0.32, ease: [0.2, 0, 0, 1] },
      });
      return;
    }

    positionBeforeChatRef.current = { x: x.get(), y: y.get() };
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
        x: positionBeforeChatRef.current.x + deltaX,
        y: positionBeforeChatRef.current.y + deltaY,
        transition: { duration: 0.32, ease: [0.2, 0, 0, 1] },
      });
    });

    return () => window.cancelAnimationFrame(frame);
  }, [controls, isChatOpen, x, y]);

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
        style={{ x, y }}
        animate={controls}
        drag={Boolean(dragBounds) && !isChatOpen}
        dragConstraints={dragBounds ?? undefined}
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
