"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealSectionProps {
  children: ReactNode;
  className?: string;
}

export default function RevealSection({ children, className = "" }: RevealSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const revealRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = revealRef.current;
    if (!element) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.12 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={revealRef} className={`section-reveal ${isVisible ? "section-reveal-visible" : ""} ${className}`}>
      {children}
    </div>
  );
}
