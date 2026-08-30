import React from "react";

export default function Hero() {
  return (
    <section
      aria-label="Hero Introduction"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <h1 className="text-[length:var(--text-heading-h1)] md:text-[length:var(--text-display-xl)] leading-[var(--text-heading-h1--line-height)] md:leading-[var(--text-display-xl--line-height)] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-display)]">
        TODO: Firstname Lastname
      </h1>
      <p className="mt-[var(--spacing-4)] md:mt-[var(--spacing-5)] text-[length:var(--text-body-l)] leading-[var(--text-body-l--line-height)] font-[number:var(--font-weight-regular)] text-[var(--color-text-secondary)] max-w-3xl">
        TODO: Software Engineer building resilient distributed systems and intelligent interfaces.
      </p>
    </section>
  );
}
