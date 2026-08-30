import React from "react";

interface FrontendShowcaseProps {
  demoVideo?: string;
  demoImage?: string;
  title: string;
}

export default function FrontendShowcase({ demoVideo, demoImage, title }: FrontendShowcaseProps) {
  return (
    /* Outer glassy ambient container */
    <div className="relative w-full rounded-[var(--radius-lg)] overflow-hidden">
      {/* Ambient glow layers */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 blur-3xl opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, var(--color-accent-primary) 0%, transparent 60%),
                       radial-gradient(ellipse at 70% 50%, var(--color-accent-secondary) 0%, transparent 60%)`,
        }}
      />

      {/* Glass frame */}
      <div className="w-full rounded-[var(--radius-lg)] border border-white/30 bg-white/10 backdrop-blur-sm p-[0.5rem] shadow-xl">
        {/* Window chrome bar */}
        <div className="flex items-center gap-[0.375rem] px-[var(--spacing-3)] py-[var(--spacing-2)] rounded-t-[calc(var(--radius-lg)-0.5rem)] bg-white/60 backdrop-blur-md border-b border-white/40">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="w-3 h-3 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-[var(--spacing-3)] text-[length:var(--text-caption)] font-mono text-[var(--color-text-muted)]">
            {title.toLowerCase().replace(/\s+/g, '-')}.app
          </span>
        </div>

        {/* Content area */}
        <div className="relative w-full aspect-video rounded-b-[calc(var(--radius-lg)-0.5rem)] overflow-hidden bg-[var(--color-neutral-100)]">
          {demoVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              aria-label={`Demo of ${title}`}
            >
              <source src={demoVideo} type="video/mp4" />
              <source src={demoVideo.replace('.mp4', '.webm')} type="video/webm" />
            </video>
          ) : demoImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={demoImage}
              alt={`Screenshot of ${title}`}
              className="w-full h-full object-cover object-top"
            />
          ) : (
            /* Placeholder gradient tile */
            <div
              className="w-full h-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, var(--color-neutral-100) 0%, var(--color-neutral-200) 100%)`,
              }}
            >
              <p className="text-[length:var(--text-label)] text-[var(--color-text-muted)] font-mono">
                TODO: Add demo video or screenshot
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
