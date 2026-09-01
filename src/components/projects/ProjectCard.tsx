"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowUpRight, ChevronDownIcon, ArrowLeft, ExternalLink } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { ProjectData } from "@/lib/content";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  // Auto-reset back to overview when the visitor scrolls past the card
  useEffect(() => {
    const cardElement = cardRef.current;
    if (!cardElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          setShowDetails(false);
        }
      },
      { threshold: 0 }
    );

    observer.observe(cardElement);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className="group flex flex-col  lg:justify-between lg:flex-row items-center gap-4 lg:gap-10 py-12 lg:py-16"
    >
      {/* Left Column: In-Place Collapsible Overview <-> Details */}
      <div className="lg:w-5/12 w-full flex flex-col justify-center min-h-[380px]">
        {!showDetails ? (
          /* OVERVIEW STATE */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="space-y-4">
              {/* Clean Typography Title */}
              <h3 className="text-3xl md:text-4xl lg:text-[40px] font-normal md:font-medium text-[var(--color-text-primary)] tracking-tight leading-[1.2]">
                {project.title}
              </h3>

              {/* Constrained Description */}
              <p className="text-base md:text-lg leading-[1.7] text-[var(--color-text-secondary)] font-normal max-w-[420px] pt-1">
                {project.description || project.summary}
              </p>
            </div>

            {/* Borderless "View full details" Trigger */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetails(true)}
                className="group/btn inline-flex items-center gap-2 text-sm md:text-base font-medium text-[var(--color-text-primary)] hover:opacity-75 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
              >
                <span>View full details</span>
                <ChevronDownIcon className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </button>
            </div>
          </div>
        ) : (
          /* FULL DETAILS STATE */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 py-1">
            {/* 1. View Overview Button at Top */}
            <div>
              <button
                type="button"
                onClick={() => setShowDetails(false)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-text-primary)] hover:opacity-75 transition-opacity cursor-pointer focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>View overview</span>
              </button>
            </div>

            {/* 2. Award Details in Clean Caption Style */}
            {project.award && (
              <p className="text-[length:var(--text-caption)] text-[var(--color-text-muted)] leading-relaxed pt-1">
                {project.award.title} &middot; {project.award.details}
              </p>
            )}

            {/* 3. Time Taken to Build */}
            {project.timeTaken && (
              <div className="text-sm">
                <span className="text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider block">
                  Time to build:
                </span>
                <span className="text-[var(--color-text-primary)] font-medium">
                  {project.timeTaken}
                </span>
              </div>
            )}

            {/* 4. Key Metrics List */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider block">
                  Key Metrics:
                </span>
                <ul className="space-y-1 text-sm text-[var(--color-text-secondary)]">
                  {project.metrics.map((metric, i) => (
                    <li key={i} className="flex items-baseline gap-2">
                      <span className="text-[var(--color-text-muted)] select-none">&bull;</span>
                      <span>{metric}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 5. Tech Stack */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider block">
                Technologies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2.5 py-1 rounded-[var(--radius-sm)] bg-[var(--color-neutral-100)] text-[var(--color-text-secondary)] border border-[var(--color-border-default)]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. Architecture / What Was Built */}
            {(project.details?.architecture || project.details?.overview) && (
              <div className="space-y-1 text-sm text-[var(--color-text-secondary)] leading-relaxed pt-1">
                <span className="text-[var(--color-text-muted)] font-mono text-xs uppercase tracking-wider block">
                  Architecture &amp; Engineering:
                </span>
                <p>
                  {project.details.architecture || project.details.overview}
                </p>
              </div>
            )}

            {/* 7. Action Links */}
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-[var(--color-border-default)]/60">
              {project.githubUrl && !project.workplace && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-text-primary)] hover:opacity-75 transition-opacity"
                >
                  <SiGithub className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              )}
              {project.docsUrl && (
                <a
                  href={project.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] hover:opacity-75 transition-opacity"
                >
                  <span>View docs</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] hover:opacity-75 transition-opacity"
                >
                  <span>Live project</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {project.workplace && (
                <span className="text-xs text-[var(--color-text-muted)] italic">
                  Proprietary system &mdash; source confidential
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="lg:w-5/10 lg:ml-auto w-full flex items-center">
        <div className="relative w-full aspect-[4/3] min-h-[430px] md:min-h-[480px] lg:min-h-[520px] rounded-4xl md:rounded-4xl overflow-hidden border border-[var(--color-border-default)]/60 bg-[var(--color-background-subtle)] duration-300 group-hover:shadow-sm">
          
          {/* Multi-Color Ambient Glow */}
          <div 
            className="absolute inset-0 pointer-events-none" 
            style={{
              background: "radial-gradient(ellipse 80% 55% at 50% 0%, rgba(96, 165, 250, 0.3) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 0% 80%, rgba(251, 191, 36, 0.24) 0%, transparent 65%), radial-gradient(ellipse 50% 50% at 100% 80%, rgba(163, 230, 53, 0.24) 0%, transparent 65%)"
            }}
          />

          {/* Inner Stage: Centered horizontally, spaced at top, flush to bottom */}
          <div className="absolute top-8 md:top-10 lg:top-12 left-4 right-4 md:left-5 md:right-5 lg:left-5 lg:right-5 bottom-0 rounded-t-2xl md:rounded-t-3xl bg-[var(--color-neutral-100)] border-t border-x border-gray-200 shadow-[0_12px_32px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col">
            {project.demoVideo ? (
              <video
                src={project.demoVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover object-top"
              />
            ) : project.demoImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.demoImage}
                alt={project.title}
                className="w-full h-full object-cover object-top"
              />
            ) : (
              /* Fallback Stage Preview */
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 font-mono text-xs text-[var(--color-text-secondary)]">
                <div className="p-4 rounded-2xl bg-white border border-[var(--color-border-default)] shadow-xs">
                  <span className="text-xl font-bold text-[var(--color-text-primary)]">
                    {project.title.replace("TODO: ", "").slice(0, 3).toUpperCase()}
                  </span>
                </div>
                <span className="font-semibold text-sm text-[var(--color-text-primary)]">
                  {project.title}
                </span>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {project.type || "AI & Frontend"} Pipeline Preview
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}