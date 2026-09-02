import { TechCategory } from "@/lib/content";

interface TechStackProps {
  techStack: TechCategory[];
}

export default function TechStack({ techStack }: TechStackProps) {
  if (!techStack || techStack.length === 0) return null;

  return (
    <section
      id="technologies"
      aria-label="Technologies"
      className="relative py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] overflow-hidden"
    >
      {/* Future WebGL / Canvas particle stage mount point */}
      <div
        id="canvas-particle-stage"
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Main Content Stage */}
      <div className="relative z-10">
        <h2 className="text-[length:var(--text-heading-h3)] md:text-[length:var(--text-heading-h2)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-8)] md:mb-[var(--spacing-9)]">
          Technologies
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {techStack.map((group) => (
            <div key={group.category} className="flex flex-col">
              <h3 className="text-[length:var(--text-label)] font-mono text-[var(--color-text-muted)] tracking-widest uppercase mb-6 select-none">
                {group.category}
              </h3>
              <ul role="list" className="flex flex-col space-y-4">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="text-[length:var(--text-body-l)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors duration-200 cursor-default select-none"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
