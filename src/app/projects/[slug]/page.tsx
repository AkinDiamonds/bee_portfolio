import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/nav/Navbar";
import MetricsGrid from "@/components/projects/MetricsGrid";
import FrontendShowcase from "@/components/projects/FrontendShowcase";
import ProjectSidebar from "@/components/projects/ProjectSidebar";
import { getProjectBySlug, getProjects } from "@/lib/content";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const isFrontend = project.type === "frontend" || project.type === "fullstack";
  const hasMetrics = Array.isArray(project.metrics) && project.metrics.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />

      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]">

        {/* Back link */}
        <Link
          href="/#projects"
          className="inline-flex items-center gap-[var(--spacing-2)] text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors mb-[var(--spacing-8)] focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Overview
        </Link>

        {/* Header */}
        <header className="max-w-3xl mb-[var(--spacing-8)]">
          <div className="flex items-center gap-[var(--spacing-3)] mb-[var(--spacing-4)] text-[length:var(--text-caption)] font-mono uppercase tracking-widest text-[var(--color-text-muted)]">
            <span>{project.type}</span>
            {project.duration && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.duration}</span>
              </>
            )}
          </div>

          <h1 className="text-[length:var(--text-heading-h1)] leading-[var(--text-heading-h1--line-height)] md:text-[length:var(--text-display-l)] md:leading-[var(--text-display-l--line-height)] font-[number:var(--font-weight-bold)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-4)]">
            {project.title}
          </h1>

          <p className="text-[length:var(--text-body-l)] leading-[var(--text-body-l--line-height)] text-[var(--color-text-secondary)]">
            {project.description || project.summary}
          </p>
        </header>

        {/* Two-column layout: Main + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-8)] lg:gap-[var(--spacing-9)] items-start">

          {/* Left / Main content */}
          <div className="lg:col-span-8 space-y-[var(--spacing-8)]">

            {/* Frontend: glassy video/image showcase */}
            {isFrontend && (
              <FrontendShowcase
                demoVideo={project.demoVideo}
                demoImage={project.demoImage}
                title={project.title}
              />
            )}

            {/* Metrics — always shown when present, prominent for backend */}
            {hasMetrics && (
              <section aria-label="Impact Metrics">
                <h2 className="text-[length:var(--text-label)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-muted)] uppercase tracking-wider mb-[var(--spacing-4)]">
                  {isFrontend ? "Results" : "Impact & Results"}
                </h2>
                <MetricsGrid metrics={project.metrics!} />
              </section>
            )}

            {/* Narrative content */}
            {project.content && project.content.trim() && (
              <section
                aria-label="Project Details"
                className="prose prose-zinc max-w-none text-[length:var(--text-body-m)] leading-[var(--text-body-m--line-height)] text-[var(--color-text-secondary)]"
              >
                <div className="whitespace-pre-line">{project.content}</div>
              </section>
            )}
          </div>

          {/* Right / Sidebar */}
          <ProjectSidebar project={project} />
        </div>
      </main>
    </div>
  );
}