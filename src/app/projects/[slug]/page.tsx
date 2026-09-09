import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import Footer from "@/components/footer/Footer";
import { getProjectBySlug, getSiteProfile } from "@/lib/firestore";
import { ArrowUpRight, ArrowLeft, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} — Simeon Akinrinola`,
    description: project.summary || project.description,
    openGraph: {
      title: project.title,
      description: project.summary || project.description,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, profile] = await Promise.all([
    getProjectBySlug(slug),
    getSiteProfile(),
  ]);

  if (!project || !project.visibility) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar profile={profile} />

      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-8)] md:py-[var(--spacing-9)] flex flex-col gap-[var(--spacing-8)]">
        {/* Back Link */}
        <div>
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to projects</span>
          </Link>
        </div>

        {/* Header Block */}
        <div className="flex flex-col gap-[var(--spacing-4)] max-w-3xl">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[length:var(--text-label)] font-mono uppercase text-[var(--color-text-muted)] tracking-wider">
              {project.type || "Engineering & AI"}
            </span>
            {project.timeTaken && (
              <>
                <span className="text-[var(--color-text-muted)]">·</span>
                <span className="text-[length:var(--text-label)] text-[var(--color-text-muted)]">
                  {project.timeTaken}
                </span>
              </>
            )}
            {project.award && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[length:var(--text-caption)] font-medium border border-amber-500/20">
                ★ {project.award.title}
              </span>
            )}
          </div>

          <h1 className="text-[length:var(--text-heading-h1)] md:text-[length:var(--text-display-l)] font-[number:var(--font-weight-bold)] tracking-[var(--tracking-tight-display)] leading-[1.05]">
            {project.title}
          </h1>

          <p className="text-[length:var(--text-body-l)] text-[var(--color-text-secondary)] leading-relaxed">
            {project.description || project.summary}
          </p>
        </div>

        {/* Media Showcase Tile */}
        {project.demoUrl && (
          <div className="w-full rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] shadow-sm">
            {project.demoType === "video" ? (
              <video
                src={project.demoUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-auto max-h-[680px] object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.demoUrl}
                alt={project.title}
                className="w-full h-auto max-h-[680px] object-cover"
              />
            )}
          </div>
        )}

        {/* Project Meta & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-[var(--spacing-6)] border-t border-[var(--color-border-default)]">
          {/* Main Details (Left 2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-[var(--spacing-6)]">
            {project.details?.overview && (
              <div className="flex flex-col gap-2">
                <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)]">
                  Overview
                </h2>
                <p className="text-[length:var(--text-body-m)] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {project.details.overview}
                </p>
              </div>
            )}

            {project.details?.architecture && (
              <div className="flex flex-col gap-2">
                <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)]">
                  Architecture &amp; Implementation
                </h2>
                <p className="text-[length:var(--text-body-m)] text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">
                  {project.details.architecture}
                </p>
              </div>
            )}

            {project.metrics && project.metrics.length > 0 && (
              <div className="flex flex-col gap-2">
                <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)]">
                  Key Metrics &amp; Impact
                </h2>
                <ul className="list-disc pl-5 space-y-1 text-[length:var(--text-body-m)] text-[var(--color-text-secondary)]">
                  {project.metrics.map((metric, idx) => (
                    <li key={idx}>{metric}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar / Metadata (Right col) */}
          <div className="flex flex-col gap-[var(--spacing-6)]">
            {/* Tech stack */}
            {project.tags && project.tags.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className="text-[length:var(--text-label)] font-mono uppercase text-[var(--color-text-muted)] tracking-wider">
                  Technologies
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-mono px-3 py-1 rounded-[var(--radius-sm)] bg-[var(--color-neutral-100)] text-[var(--color-text-primary)] border border-[var(--color-border-default)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Links */}
            <div className="flex flex-col gap-3 pt-2">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-4 py-3 bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] hover:opacity-90 active:scale-95 transition-all"
                >
                  <span>Visit Live Project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              {project.githubUrl && !project.workplace && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-4 py-3 border border-[var(--color-border-default)] bg-[var(--color-background-default)] text-[var(--color-text-primary)] rounded-[var(--radius-sm)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] hover:bg-[var(--color-background-subtle)] active:scale-95 transition-all"
                >
                  <span className="flex items-center gap-2">
                    <SiGithub className="w-4 h-4" />
                    <span>View Repository</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {project.docsUrl && (
                <a
                  href={project.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between px-4 py-3 border border-[var(--color-border-default)] bg-[var(--color-background-default)] text-[var(--color-text-primary)] rounded-[var(--radius-sm)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] hover:bg-[var(--color-background-subtle)] active:scale-95 transition-all"
                >
                  <span>Read Documentation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              {project.workplace && (
                <p className="text-xs text-[var(--color-text-muted)] italic">
                  Proprietary system — code and architecture details under NDA.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer profile={profile} />
    </div>
  );
}
