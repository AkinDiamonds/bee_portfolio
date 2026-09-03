"use client";

import { useRive } from "@rive-app/react-canvas";
import { useEffect, useRef, useState } from "react";

interface CatRiveCanvasProps {
  className?: string;
  onActivate?: () => void;
  ariaLabel?: string;
}

export default function CatRiveCanvas({
  className = "",
  onActivate,
  ariaLabel = "Portfolio agent cat. Click or press Enter to chat.",
}: CatRiveCanvasProps) {
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { RiveComponent, rive } = useRive({
    src: "/8080-22270-cat-eyes.riv",
    artboard: "Cat Artboard",
    stateMachine: "State Machine 1",
    autoplay: true,
    onLoadError: (err) => {
      console.error("Rive load error:", err);
      setHasError(true);
    },
  });

  // Track the cursor across the entire window and forward real normalized
  // coordinates into Rive's canvas pointer listeners so the cat's gaze
  // tracks the mouse anywhere on the screen.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !rive) return;

    const onPointerMove = (e: PointerEvent) => {
      const canvas = container.querySelector("canvas");
      if (!canvas) return;

      // Dispatch genuine pointermove event targeted directly at the canvas
      const syntheticEvent = new PointerEvent("pointermove", {
        clientX: e.clientX,
        clientY: e.clientY,
        screenX: e.screenX,
        screenY: e.screenY,
        bubbles: true,
        cancelable: false,
        pointerId: e.pointerId || 1,
        pointerType: e.pointerType || "mouse",
      });

      canvas.dispatchEvent(syntheticEvent);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [rive]);

  if (hasError) return null;

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate?.();
        }
      }}
      className={`relative cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-neutral-900)] rounded-full transition-transform hover:scale-105 active:scale-95 ${className}`}
      style={{ touchAction: "manipulation" }}
    >
      <div className="w-full h-full pointer-events-auto">
        <RiveComponent aria-hidden="true" className="w-full h-full" />
      </div>
    </div>
  );
}
