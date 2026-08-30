import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, Layers } from "lucide-react";
import { getProjects, ProjectData } from "@/lib/content";

interface ProjectCardProps {
  project: ProjectData;
  index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center py-8">
      {/* Left Column: Typography & Details */}
      <div className="lg:col-span-5 flex flex-col justify-center space-y-5 order-2 lg:order-1">
        
        {/* Project Index / Type Indicator */}
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-secondary)] tracking-wider uppercase">
          <span>0{index + 1}</span>
          <span>&middot;</span>
          <span>Full Stack</span>
        </div>

        {/* Title */}
        <h3 className="text-2xl md:text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight">
          {project.title}
        </h3>

        {/* Description */}
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          {project.description || project.summary}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-2 pt-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono px-2.5 py-1 bg-[var(--color-neutral-100)] text-[var(--color-text-secondary)] rounded-md border border-[var(--color-border-default)]/40"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action Link */}
        <div className="pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-text-primary)] hover:opacity-80 transition-opacity"
          >
            <span>View Case Study</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Right Column: Glass Stage Preview */}
      <div className="lg:col-span-7 order-1 lg:order-2">
        <div className="relative w-full aspect-[16/10] rounded-2xl p-6 md:p-8 flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100/80 via-purple-50/30 to-blue-50/40 border border-white/80 shadow-sm transition-all duration-300 group-hover:shadow-md">
          
          {/* Subtle Metallic Ambient Glow Layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.8),transparent_70%)] pointer-events-none" />

          {/* Inner Floating Glass Frame */}
          <div className="relative w-full h-full rounded-xl bg-white/70 backdrop-blur-md border border-white/90 shadow-xl p-5 flex flex-col justify-between overflow-hidden transform transition-transform duration-300 group-hover:scale-[1.01]">
            
            {/* Top Bar of Mock Window */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-300" />
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                {project.slug}.sys
              </span>
            </div>

            {/* Inner Content Display */}
            <div className="flex-1 flex flex-col justify-center items-center py-4 text-center">
              <div className="flex items-center gap-4 text-gray-700">
                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 text-xs font-mono">
                  <Cpu className="w-4 h-4 text-blue-600" /> API Gateway
                </div>
                <div className="w-8 h-px bg-gray-300" />
                <div className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center gap-2 text-xs font-mono">
                  <Layers className="w-4 h-4 text-purple-600" /> Pipeline
                </div>
              </div>
            </div>

            {/* Bottom Meta Bar */}
            <div className="flex items-center justify-between text-[11px] font-mono text-gray-400 pt-2 border-t border-gray-100">
              <span>High Performance</span>
              <span>v2.4.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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