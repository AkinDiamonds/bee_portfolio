import React from "react";
import Link from "next/link";
import { ProjectData } from "@/lib/content";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article
      className="grid grid-cols-1 md:grid-cols-12 gap-[var(--spacing-6)] md:gap-[var(--spacing-8)] items-center border-t border-[var(--color-border-default)] pt-[var(--spacing-8)] first:border-t-0 first:pt-0"
    >
      {/* Text column (left) */}
      <div className="md:col-span-6 flex flex-col justify-center">
        <div className="flex flex-wrap gap-[var(--spacing-2)] mb-[var(--spacing-3)]">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-[length:var(--text-caption)] font-[number:var(--font-weight-medium)] text-[var(--color-text-muted)] tracking-normal"
            >
              {tag}
            </span>
          ))}
        </div>

        <h3 className="text-[length:var(--text-heading-h2)] leading-[var(--text-heading-h2--line-height)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-4)]">
          <Link
            href={`/projects/${project.slug}`}
            className="hover:opacity-80 focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)] transition-opacity"
          >
            {project.title}
          </Link>
        </h3>

        <p className="text-[length:var(--text-body-m)] leading-[var(--text-body-m--line-height)] font-[number:var(--font-weight-regular)] text-[var(--color-text-secondary)] mb-[var(--spacing-5)]">
          {project.description || project.summary}
        </p>

        <div>
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
          >
            <span>View Case Study</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Visual Tile column (right) */}
      <div className="md:col-span-6">
        <Link
          href={`/projects/${project.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block aspect-4/3 rounded-[var(--radius-lg)] overflow-hidden relative border border-[var(--color-border-default)] group bg-[var(--color-background-subtle)] focus-visible:outline-none"
        >
          {/* Soft radial-glow treatment using --color-accent-primary -> --color-accent-secondary */}
          <div
            className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, var(--color-accent-primary) 0%, var(--color-accent-secondary) 70%, transparent 100%)`,
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-[var(--spacing-6)]">
            <div className="text-center">
              <span className="text-[length:var(--text-display-l)] font-[number:var(--font-weight-bold)] text-[var(--color-text-muted)] opacity-30 select-none">
                0{index + 1}
              </span>
              <p className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-muted)] mt-[var(--spacing-2)]">
                {project.slug}
              </p>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}
