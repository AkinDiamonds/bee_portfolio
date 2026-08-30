import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <section
      aria-label="Hero Introduction"
      className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center text-center px-[var(--spacing-5)] py-[var(--spacing-8)] overflow-hidden"
    >
      {/* Container constrained for optimal reading width and Bee clearance */}
      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        
        {/* Technical label */}
        <span className="mb-[var(--spacing-5)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-secondary)] tracking-widest">
          Simeon Akinrinola
        </span>

        {/* Main Headline: Value Proposition */}
        <h1 className="text-[length:var(--text-heading-h2)] md:text-[length:var(--text-display-l)] leading-[1.05] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-display)] text-balance">
          Building better software, <br className="hidden md:block" /> faster.
        </h1>

        {/* Subtitle: The "How" and "What" */}
        <p className="mt-[var(--spacing-6)] text-[length:var(--text-body-l)] md:text-[20px] leading-relaxed font-[number:var(--font-weight-regular)] text-[var(--color-text-secondary)] max-w-xl text-balance">
          Frontend, Backend, and AI Engineering.
        </p>

        {/* Action Pills */}
        <div className="mt-[var(--spacing-8)] flex items-center justify-center gap-[var(--spacing-4)] flex-wrap">
          <Link
            href="#projects"
            className="inline-flex items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-3)] bg-[var(--color-text-primary)] text-[var(--color-neutral-0)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] rounded-full transition-transform active:scale-95 hover:opacity-90 shadow-sm"
          >
            Explore Projects
          </Link>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-3)] bg-[var(--color-neutral-100)] text-[var(--color-text-primary)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] rounded-full transition-colors hover:bg-[var(--color-neutral-200)] active:scale-95"
          >
            Read Articles
          </Link>
        </div>
      </div>

      {/* Bee Perch*/}
      <div 
        id="bee-perch-target" 
        className="aria-hidden:true pointer-events-none absolute top-12 right-6 md:right-16 w-32 h-32 md:w-48 md:h-48"
      />
    </section>
  );
}