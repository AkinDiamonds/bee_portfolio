"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { TestimonialItem } from "@/lib/content";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trackRef = useRef<HTMLDivElement>(null);

  function goTo(idx: number) {
    if (idx === activeIndex || animating) return;
    setAnimating(true);
    setPrevIndex(activeIndex);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setActiveIndex(idx);
      setPrevIndex(null);
      setAnimating(false);
    }, 220);
  }

  useEffect(() => {
    if (trackRef.current) {
      const activeEl = trackRef.current.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`);
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (!testimonials || testimonials.length === 0) return null;

  const displayed = animating && prevIndex !== null ? testimonials[prevIndex] : testimonials[activeIndex];

  return (
    <section
      id="testimonials"
      aria-label="Testimonials"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      {/* Section label — Option D: whisper-level, all-lowercase, muted, tracked */}
      <p
        aria-hidden="true"
        className="text-[length:var(--text-body-l)] font-[number:var(--font-weight-regular)] text-[var(--color-text-muted)] tracking-[0.08em] lowercase mb-[var(--spacing-8)] md:mb-[var(--spacing-9)] select-none"
      >
        nice things great persons said about me
      </p>

      {/* Quote stage */}
      <div className="flex flex-col items-center text-center">
        {/* Quote text with CSS fade+drift transition */}
        <div className="relative w-full min-h-[8rem] md:min-h-[6rem] flex items-center justify-center mb-[var(--spacing-6)]">
          <blockquote
            key={activeIndex}
            className={[
              "max-w-3xl mx-auto",
              "text-[length:var(--text-quote)] md:text-[length:var(--text-heading-h2)]",
              "leading-[1.25] font-[number:var(--font-weight-regular)]",
              "tracking-[var(--tracking-tight-heading)]",
              "text-[var(--color-text-primary)]",
              animating
                ? "opacity-0 translate-y-2 transition-none"
                : "opacity-100 translate-y-0 transition-all duration-400 ease-in-out",
            ].join(" ")}
            aria-live="polite"
          >
            &ldquo;{displayed.quote}&rdquo;
          </blockquote>
        </div>

        {/* Author details */}
        <div
          key={`author-${activeIndex}`}
          className={[
            "flex flex-col items-center gap-[var(--spacing-1)] mb-[var(--spacing-8)]",
            animating
              ? "opacity-0 translate-y-1 transition-none"
              : "opacity-100 translate-y-0 transition-all duration-400 ease-in-out",
          ].join(" ")}
        >
          <span className="text-[length:var(--text-body-m)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            {displayed.name}
          </span>
          <span className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-muted)] tracking-[0.04em]">
            {displayed.role} · {displayed.company}
          </span>
        </div>

        {/* Avatar track — horizontally scrollable when overflowing, centered when small */}
        <div className="w-full max-w-xl px-4 flex justify-center">
          <div
            ref={trackRef}
            role="tablist"
            aria-label="Select testimonial"
            className="flex items-center justify-start sm:justify-center gap-[var(--spacing-4)] overflow-x-auto py-2 px-3 max-w-full scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {testimonials.map((t, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={t.name}
                  data-index={idx}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Show testimonial from ${t.name}`}
                  onClick={() => goTo(idx)}
                  className={[
                    "shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 cursor-pointer",
                    "transition-all duration-300 ease-in-out",
                    isActive
                      ? "ring-2 ring-[var(--color-border-default)] ring-offset-2 scale-110 opacity-100"
                      : "opacity-50 scale-95 grayscale hover:opacity-75 hover:scale-100",
                  ].join(" ")}
                >
                  <Image
                    src={t.avatarUrl}
                    alt={t.name}
                    width={48}
                    height={48}
                    className="rounded-full w-12 h-12 object-cover pointer-events-none"
                    unoptimized
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
