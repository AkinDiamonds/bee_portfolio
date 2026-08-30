import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/nav/Navbar";
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

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]">
        <Link
          href="/"
          className="inline-block text-[length:var(--text-label)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-[var(--spacing-6)]"
        >
          ← Back to Overview
        </Link>
        <article className="max-w-3xl">
          <h1 className="text-[length:var(--text-heading-h1)] leading-[var(--text-heading-h1--line-height)] font-[number:var(--font-weight-bold)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-4)]">
            {project.title}
          </h1>
          <p className="text-[length:var(--text-body-l)] leading-[var(--text-body-l--line-height)] text-[var(--color-text-secondary)] mb-[var(--spacing-6)]">
            {project.description || project.summary}
          </p>

          <div className="flex flex-wrap gap-[var(--spacing-2)] mb-[var(--spacing-8)]">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[length:var(--text-caption)] font-[number:var(--font-weight-medium)] px-[var(--spacing-3)] py-[var(--spacing-1)] rounded-[var(--radius-pill)] border border-[var(--color-border-default)] text-[var(--color-text-secondary)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-[length:var(--text-body-m)] text-[var(--color-text-secondary)] whitespace-pre-line">
            {project.content}
          </div>
        </article>
      </main>
    </div>
  );
}
