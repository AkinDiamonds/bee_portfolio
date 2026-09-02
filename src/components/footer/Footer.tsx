import React from "react";
import { Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { SiGithub } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full overflow-hidden mt-[var(--spacing-section-mobile)] md:mt-[var(--spacing-section)]">
      {/* STEP 1: TOP METADATA ROW */}
      <div className="py-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        {/* Left: Quote & Subtext */}
        <div className="max-w-xl">
          <p className="text-sm md:text-base font-medium text-[var(--color-text-primary)] leading-snug">
            &ldquo;This site is haunted by a bee. It&apos;s not a bug, it&apos;s the most important feature.&rdquo;
          </p>
          <p className="text-xs text-[var(--color-text-muted)] font-mono mt-1">
            The bee is eval-driven and is constantly improved.{" "}
            <a
              href="#bee"
              className="text-[var(--color-text-muted)] hover:text-[var(--color-bee-accent)] transition-colors underline inline-flex items-center gap-1"
            >
              Learn more
            </a>
          </p>
        </div>

        {/* Right: Naked SVG Social Icons */}
        <div className="flex items-center gap-6 shrink-0">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profile"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-bee-accent)] transition-colors duration-300"
          >
            <FaLinkedin className="w-5 h-5" />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profile"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-bee-accent)] transition-colors duration-300"
          >
            <SiGithub className="w-5 h-5" />
          </a>
          <a
            href="mailto:simeon@example.com"
            aria-label="Send Email"
            className="text-[var(--color-text-muted)] hover:text-[var(--color-bee-accent)] transition-colors duration-300"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* STEP 2: THE MASSIVE MONOLITH */}
      <div
        id="bee-playground"
        className="w-full text-center md:text-left select-none my-8"
      >
        <span className="text-[18vw] leading-[0.8] tracking-tighter font-bold text-[var(--color-text-primary)] block font-display">
          SIMEON.
        </span>
      </div>

      {/* STEP 3: BOTTOM ANCHOR ROW */}
      <div className="pt-8 pb-12 flex flex-col md:flex-row justify-between items-center text-xs text-[var(--color-text-muted)] font-mono">
        <p>© {currentYear} Simeon Akinrinola. All rights reserved.</p>
      </div>
    </footer>
  );
}
