import React from "react";
import Link from "next/link";
import { SiGithub } from "react-icons/si";
import { ExternalLink, Lock } from "lucide-react";
import { ProjectData } from "@/lib/content";

interface ProjectSidebarProps {
  project: ProjectData;
}

export default function ProjectSidebar({ project }: ProjectSidebarProps) {
  const isWorkplace = project.workplace;
  const githubUrl = project.githubUrl || project.links?.github;
  const liveUrl = project.liveUrl || project.links?.live;

  return (
    <aside className="lg:col-span-4">
      <div className="sticky top-[calc(var(--spacing-8)+1rem)] space-y-[var(--spacing-6)] p-[var(--spacing-6)] bg-[var(--color-neutral-0)] border border-[var(--color-border-default)] rounded-[var(--radius-lg)]">

        {/* Role & Duration */}
        {(project.role || project.duration) && (
          <div>
            {project.role && (
              <p className="text-[length:var(--text-body-s)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
                {project.role}
              </p>
            )}
            {project.duration && (
              <p className="mt-[var(--spacing-1)] text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                {project.duration}
              </p>
            )}
          </div>
        )}

        {/* Tags */}
        <div>
          <h4 className="text-[length:var(--text-caption)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-muted)] uppercase tracking-wider mb-[var(--spacing-3)]">
            Technologies
          </h4>
          <div className="flex flex-wrap gap-[var(--spacing-2)]">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[length:var(--text-caption)] font-mono px-[var(--spacing-2)] py-[var(--spacing-1)] rounded-[var(--radius-sm)] bg-[var(--color-neutral-100)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="space-y-[var(--spacing-2)]">
          {liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[var(--spacing-2)] w-full px-[var(--spacing-4)] py-[var(--spacing-3)] bg-[var(--color-action-primary)] text-[var(--color-action-secondary)] text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] rounded-[var(--radius-pill)] hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)]"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              <span>View Live</span>
            </a>
          )}

          {githubUrl && !isWorkplace && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-[var(--spacing-2)] w-full px-[var(--spacing-4)] py-[var(--spacing-3)] bg-[var(--color-neutral-100)] text-[var(--color-text-primary)] text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] rounded-[var(--radius-pill)] hover:bg-[var(--color-neutral-200)] transition-colors border border-[var(--color-border-default)] focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)]"
            >
              <SiGithub className="w-4 h-4" aria-hidden="true" />
              <span>Source Code</span>
            </a>
          )}

          {isWorkplace && (
            <div className="flex items-center gap-[var(--spacing-2)] w-full px-[var(--spacing-4)] py-[var(--spacing-3)] bg-[var(--color-neutral-100)] text-[var(--color-text-muted)] text-[length:var(--text-label)] rounded-[var(--radius-pill)] border border-[var(--color-border-default)] select-none">
              <Lock className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Proprietary · Source Confidential</span>
            </div>
          )}
        </div>

        {/* Back link */}
        <Link
          href="/#projects"
          className="block text-[length:var(--text-caption)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
        >
          ← Back to all projects
        </Link>
      </div>
    </aside>
  );
}
