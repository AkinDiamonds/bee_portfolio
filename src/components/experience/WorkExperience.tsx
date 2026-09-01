import React from "react";
import { getExperience, formatExperiencePeriod } from "@/lib/content";

export default function WorkExperience() {
  const experiences = getExperience();

  return (
    <section
      id="experience"
      aria-label="Work Experience"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <h2 className="text-[length:var(--text-heading-h3)] md:text-[length:var(--text-heading-h2)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-6)] md:mb-[var(--spacing-8)] text-center">
        Work Experience
      </h2>

      <ul role="list" className="w-full">
        {experiences.map((item, idx) => (
          <li
            key={`${item.company}-${item.role}-${idx}`}
            className="border-b border-[var(--color-border-default)] py-[var(--spacing-4)] md:py-[var(--spacing-5)] transition-colors hover:bg-[var(--color-background-subtle)]/50"
          >
            {/* Mobile layout (< md) */}
            <div className="flex flex-col gap-1 md:hidden">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[length:var(--text-body-m)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
                  {item.company}
                </span>
                <span className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] font-[number:var(--font-weight-regular)] shrink-0">
                  {formatExperiencePeriod(item)}
                </span>
              </div>
              <span className="text-[length:var(--text-body-s)] text-[var(--color-text-secondary)] font-[number:var(--font-weight-regular)]">
                {item.role}
              </span>
            </div>

            {/* Desktop layout (>= md) */}
            <div className="hidden md:grid md:grid-cols-12 items-center gap-[var(--spacing-4)]">
              <span className="col-span-5 text-[length:var(--text-body-m)] font-[number:var(--font-weight-regular)] text-[var(--color-text-primary)]">
                {item.role}
              </span>
              <span className="col-span-4 text-[length:var(--text-body-m)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
                {item.company}
              </span>
              <span className="col-span-3 text-right text-[length:var(--text-body-m)] text-[var(--color-text-muted)] font-[number:var(--font-weight-regular)]">
                {formatExperiencePeriod(item)}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
