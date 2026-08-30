"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

interface ContactLink {
  label: string;
  href: string;
  external?: boolean;
}

const contactLinks: ContactLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com/in/TODO", external: true },
  { label: "WhatsApp", href: "https://wa.me/TODO", external: true },
  { label: "Email", href: "mailto:TODO@example.com" },
  { label: "Schedule a meeting", href: "https://cal.com/TODO", external: true },
  { label: "Phone", href: "tel:+1TODO" },
  { label: "Download Résumé", href: "/resume.pdf", external: true },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setMobileMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="w-full bg-[var(--color-background-default)]">
      <div className="max-w-[var(--container-portfolio)] mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-5)] flex items-center justify-between">
        {/* Left: Name / Logo */}
        <Link
          href="/"
          className="text-[length:var(--text-heading-h4)] leading-[var(--text-heading-h4--line-height)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)] focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)] transition-opacity hover:opacity-80"
          aria-label="Home"
        >
          TODO: Name
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-[var(--spacing-6)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)]"
          aria-label="Main Navigation"
        >
          <Link
            href="/blog"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)] transition-colors py-[var(--spacing-2)] px-[var(--spacing-3)]"
          >
            Blog
          </Link>

          {/* Contact Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-haspopup="true"
              aria-controls="contact-menu"
              className="inline-flex items-center gap-[var(--spacing-2)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)] transition-colors py-[var(--spacing-2)] px-[var(--spacing-3)] cursor-pointer"
            >
              <span>Contact</span>
              <svg
                aria-hidden="true"
                className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <ul
                id="contact-menu"
                role="menu"
                className="absolute right-0 mt-[var(--spacing-2)] w-56 bg-[var(--color-neutral-0)] border border-[var(--color-border-default)] rounded-[var(--radius-md)] shadow-lg py-[var(--spacing-2)] z-50 focus:outline-none"
              >
                {contactLinks.map((item) => (
                  <li key={item.label} role="none">
                    <a
                      role="menuitem"
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noopener noreferrer" : undefined}
                      onClick={() => setIsOpen(false)}
                      className="block px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-label)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-50)] focus-visible:bg-[var(--color-neutral-50)] focus-visible:outline-none transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
            className="p-[var(--spacing-2)] text-[var(--color-text-primary)] focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden border-b border-[var(--color-border-default)] px-[var(--spacing-5)] py-[var(--spacing-4)] bg-[var(--color-neutral-0)] flex flex-col gap-[var(--spacing-3)]"
          aria-label="Mobile Navigation"
        >
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[length:var(--text-body-m)] font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] py-[var(--spacing-2)] focus-visible:outline-none"
          >
            Blog
          </Link>
          <div className="pt-[var(--spacing-2)] border-t border-[var(--color-border-default)]">
            <p className="text-[length:var(--text-caption)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-muted)] uppercase tracking-wider mb-[var(--spacing-2)]">
              Contact
            </p>
            <ul className="flex flex-col gap-[var(--spacing-2)]">
              {contactLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-[length:var(--text-label)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-[var(--spacing-1)]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </header>
  );
}
