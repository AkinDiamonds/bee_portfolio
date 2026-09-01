import { getProjects } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";

export default function FeaturedProjects() {
  const projects = getProjects();

  return (
    <section
      aria-label="Featured Projects"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >

      <div id="projects" className=" scroll-mt-0 flex flex-col gap-4">
        {projects.map((project, idx) => (
          <ProjectCard key={project.slug} project={project} index={idx} />
        ))}
      </div>
    </section>
  );
}