import type { ProjectDoc } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

interface FeaturedProjectsProps {
  projects: ProjectDoc[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
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
        {projects.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}
