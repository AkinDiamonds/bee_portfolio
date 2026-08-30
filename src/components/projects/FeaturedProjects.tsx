import React from "react";
import { getProjects } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";

export default function FeaturedProjects() {
  const projects = getProjects();

  return (
    <section
      id="projects"
      aria-label="Featured Projects"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] border-t border-[var(--color-border-default)]"
    >
      <div className="flex items-baseline justify-between mb-[var(--spacing-8)]">
        <h2 className="text-[length:var(--text-heading-h1)] leading-[var(--text-heading-h1--line-height)] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)]">
          Featured Projects
        </h2>
      </div>

      <div className="flex flex-col gap-[var(--spacing-8)] md:gap-[var(--spacing-9)]">
        {projects.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
