import type { ProjectDoc } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: ProjectDoc[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  const visibleProjects = (projects || [])
    .filter((p) => p.visibility !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  if (visibleProjects.length === 0) return null;

  return (
    <section
      id="featured-projects"
      aria-label="Featured Projects"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      <h2 className="mb-[var(--spacing-8)] text-[length:var(--text-heading-h3)] font-[number:var(--font-weight-semibold)] tracking-[var(--tracking-tight-heading)] text-[var(--color-text-primary)] md:text-[length:var(--text-heading-h2)]">
        Featured Projects
      </h2>
      <div id="projects" className="scroll-mt-8 flex flex-col gap-[var(--spacing-4)]">
        {visibleProjects.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
