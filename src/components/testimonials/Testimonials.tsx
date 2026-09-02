"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import { TestimonialItem } from "@/lib/content";

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof window === "undefined") return;

    const updateVisibility = () => {
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      setIsInView(rect.bottom > 0 && rect.top < viewportHeight);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (!isInView || testimonials.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
    }, 4500);

    return () => window.clearInterval(interval);
  }, [isInView, testimonials.length]);

  if (testimonials.length === 0) return null;

  const selectTestimonial = (index: number) => {
    if (index === activeIndex) return;
    setActiveIndex(index);
    const track = trackRef.current;
    const activeAvatar = track?.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!track || !activeAvatar) return;

    const trackRect = track.getBoundingClientRect();
    const activeRect = activeAvatar.getBoundingClientRect();
    const nextLeft = track.scrollLeft + (activeRect.left - trackRect.left) - (trackRect.width - activeRect.width) / 2;
    track.scrollTo({ left: Math.max(0, nextLeft), behavior: "smooth" });
  };

  const handleAvatarKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + testimonials.length) % testimonials.length;
    selectTestimonial(nextIndex);
    const nextButton = trackRef.current?.querySelector<HTMLButtonElement>(`[data-index="${nextIndex}"]`);
    nextButton?.focus();
  };

  const activeTestimonial = testimonials[activeIndex];

  return (
    <section ref={sectionRef} id="testimonials" aria-label="Testimonials" aria-labelledby="testimonials-heading" className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]">
      <p id="testimonials-heading" className="mb-[var(--spacing-8)] text-[length:var(--text-body-l)] font-[number:var(--font-weight-regular)] tracking-[0.08em] text-[var(--color-text-muted)] lowercase md:mb-[var(--spacing-9)]">
        nice things great persons said about me
      </p>

      <div className="flex flex-col items-center text-center">
        <div className="relative mb-[var(--spacing-6)] flex min-h-[var(--spacing-10)] w-full items-center justify-center md:min-h-[var(--spacing-9)]">
          <blockquote className="mx-auto max-w-3xl text-[length:var(--text-quote)] font-[number:var(--font-weight-regular)] leading-[var(--text-quote--line-height)] tracking-[var(--tracking-tight-heading)] text-[var(--color-text-primary)] transition-[opacity,transform] duration-200 ease-out md:text-[length:var(--text-heading-h2)]" aria-live="polite">
            &ldquo;{activeTestimonial.quote}&rdquo;
          </blockquote>
        </div>

        <div className="mb-[var(--spacing-8)] flex flex-col items-center gap-[var(--spacing-1)] transition-[opacity,transform] duration-200 ease-out">
          <span className="text-[length:var(--text-body-m)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            {activeTestimonial.name}
          </span>
          <span className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] tracking-[0.04em] text-[var(--color-text-muted)]">
            {activeTestimonial.role} · {activeTestimonial.company}
          </span>
        </div>

        <div className="relative w-full max-w-xl px-[var(--spacing-4)]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10" style={{ width: "var(--spacing-8)", background: "linear-gradient(to right, var(--color-background-default), rgba(255,255,255,0))" }} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10" style={{ width: "var(--spacing-8)", background: "linear-gradient(to left, var(--color-background-default), rgba(255,255,255,0))" }} />
          <div
            ref={trackRef}
            role="tablist"
            aria-label="Select testimonial"
            className="overflow-x-auto px-[var(--spacing-8)] py-[var(--spacing-2)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            <div className="flex min-w-full items-center justify-center gap-[var(--spacing-4)]">
              {testimonials.map((testimonial, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`${testimonial.name}-${index}`}
                    data-index={index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Show testimonial from ${testimonial.name}`}
                    onClick={() => selectTestimonial(index)}
                    onKeyDown={(event) => handleAvatarKeyDown(event, index)}
                    className={`shrink-0 rounded-full outline-none transition-[opacity,transform,filter,box-shadow] duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[var(--color-accent-primary)] focus-visible:ring-offset-2 ${isActive ? "scale-110 opacity-100 ring-2 ring-[var(--color-border-default)] ring-offset-2" : "scale-95 grayscale opacity-50 hover:scale-100 hover:opacity-75"}`}
                    style={{ scrollSnapAlign: "center" }}
                  >
                    <Image src={testimonial.avatarUrl} alt="" width={48} height={48} loading="lazy" unoptimized className="size-12 rounded-full object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
