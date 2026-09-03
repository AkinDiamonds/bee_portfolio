"use client";

import Link from "next/link";
import { X, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export interface DialogueAction {
  label: string;
  href: string;
}

export interface DialogueItem {
  text: string;
  action?: DialogueAction;
}

interface AgentDialogueBubbleProps {
  dialogue: DialogueItem | null;
  onDismiss: () => void;
  onActionClick?: () => void;
}

export default function AgentDialogueBubble({
  dialogue,
  onDismiss,
  onActionClick,
}: AgentDialogueBubbleProps) {
  return (
    <AnimatePresence>
      {dialogue && (
        <motion.div
          key={dialogue.text}
          role="region"
          aria-live="polite"
          aria-label="Cat agent message"
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onPointerDown={(e) => e.stopPropagation()}
          className="pointer-events-auto cursor-default flex flex-col gap-2.5 w-[290px] sm:w-[320px] p-4 rounded-2xl bg-[var(--color-neutral-900)] text-[var(--color-neutral-0)] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-[var(--color-neutral-700)] backdrop-blur-md relative"
        >
          {/* Header bar inside bubble */}
          <div className="flex items-center justify-between gap-2 border-b border-[var(--color-neutral-800)] pb-1.5">
            <div className="flex items-center gap-1.5 text-[0.75rem] font-medium tracking-wide text-[var(--color-neutral-400)] uppercase">
              <Sparkles size={12} className="text-amber-400" aria-hidden="true" />
              <span>Cat Companion</span>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              aria-label="Dismiss message"
              className="p-1 -mr-1 text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-0)] hover:bg-[var(--color-neutral-800)] rounded-full transition-colors cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-neutral-0)]"
            >
              <X size={13} aria-hidden="true" />
            </button>
          </div>

          {/* Body text */}
          <p className="text-[0.9375rem] leading-relaxed text-[var(--color-neutral-100)] font-normal">
            {dialogue.text}
          </p>

          {/* Call to action button */}
          {dialogue.action && (
            <div className="pt-1">
              <Link
                href={dialogue.action.href}
                onClick={onActionClick}
                className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-amber-300 hover:text-amber-200 transition-colors group"
              >
                <span>{dialogue.action.label}</span>
                <span className="transition-transform group-hover:translate-x-0.5">→</span>
              </Link>
            </div>
          )}

          {/* Speech tail cleanly matching bubble background */}
          <span
            aria-hidden="true"
            className="absolute -bottom-2 right-8 w-0 h-0"
            style={{
              borderLeft: "8px solid transparent",
              borderRight: "8px solid transparent",
              borderTop: "8px solid var(--color-neutral-900)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
