"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ExternalLink, Download, Copy, Check } from "lucide-react";

interface ContactLink {
  label: string;
  href?: string;
  external?: boolean;
  isDownload?: boolean;
  isCopy?: boolean;
  copyValue?: string;
}

const contactLinks: ContactLink[] = [
  { label: "GitHub", href: "https://github.com/AkinDiamonds", external: true },
  { label: "LinkedIn", href: "https://linkedin.com/in/simeon-akinrinola", external: true },
  { label: "WhatsApp", href: "https://wa.me/+2349065979423", external: true },
  { label: "Email", href: "mailto:simeonakinrinola7@gmail.com" },
  { label: "Schedule a meeting", href: "https://cal.com/TODO", external: true },
  { label: "Phone", isCopy: true, copyValue: "+2349065979423" },
  { label: "Download Resume", href: "/resume.pdf", isDownload: true },
];

export default function Navbar() {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileContactOpen, setMobileContactOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Lock body scroll when mobile drawer is active
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header className="w-full bg-[var(--color-background-default)] sticky top-0 z-40">
      <div className="max-w-[var(--container-portfolio)] mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-5)] flex items-center justify-between">
        
        {/* Brand */}
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="text-[16px] font-[number:var(--font-weight-bold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)] rounded-[var(--radius-sm)] transition-opacity hover:opacity-80 z-50"
          aria-label="Home"
        >
          Simeon <span className="font-normal opacity-80">Akinrinola</span>
        </Link>

        {/* Desktop Nav */}
        <nav
          className="hidden md:flex items-center gap-[var(--spacing-6)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)]"
          aria-label="Main Navigation"
        >
          <Link
            href="/blog"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-[var(--spacing-2)] px-[var(--spacing-3)]"
          >
            Blog
          </Link>

          {/* Contact Flyout */}
          <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <button
              type="button"
              aria-expanded={isHovered}
              className="inline-flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-[var(--spacing-2)] px-[var(--spacing-3)] cursor-pointer"
            >
              <span>Contact</span>
              <ChevronDown
                className={`w-3.5 h-3.5`}
              />
            </button>

            {isHovered && (
              <div className="absolute right-0 top-full pt-1 w-52 z-50">
                <ul
                  role="menu"
                  className="bg-[var(--color-background-default)] border border-[var(--color-border-default)] shadow-sm py-2 overflow-hidden"
                >
                  {contactLinks.map((item) => (
                    <li key={item.label} role="none">
                      {item.isCopy ? (
                        <button
                          type="button"
                          onClick={() => item.copyValue && handleCopy(item.copyValue)}
                          className="w-full flex items-center justify-between px-4 py-2 text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors text-left cursor-pointer"
                        >
                          <span className="font-normal">{copied ? "Copied!" : item.label}</span>
                          {copied ? (
                            <Check className="w-3.5 h-3.5 text-green-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </button>
                      ) : (
                        <a
                          role="menuitem"
                          href={item.href}
                          target={item.external ? "_blank" : undefined}
                          rel={item.external ? "noopener noreferrer" : undefined}
                          download={item.isDownload ? true : undefined}
                          className="flex items-center justify-between px-4 py-2 text-[14px] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-100)] transition-colors"
                        >
                          <span className="font-normal">{item.label}</span>
                          {item.external && (
                            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                          )}
                          {item.isDownload && (
                            <Download className="w-3.5 h-3.5 opacity-60" />
                          )}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Trigger */}
        <div className="md:hidden flex items-center z-50">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
            className="p-[var(--spacing-2)] text-white rounded-[var(--radius-lg)] bg-[var(--color-action-primary)] shadow-sm cursor-pointer"
          >
            <svg
              className="w-5 h-5 transition-transform duration-200"
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

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <nav
          className="md:hidden fixed inset-x-0 top-[73px] bottom-0 bg-[var(--color-background-default)]/95 backdrop-blur-md px-[var(--spacing-6)] py-[var(--spacing-6)] flex flex-col gap-[var(--spacing-4)] z-40 overflow-y-auto border-t border-[var(--color-border-default)]"
          aria-label="Mobile Navigation Drawer"
        >
          {/* Blog */}
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] py-[var(--spacing-2)] border-b border-[var(--color-border-default)]/50 transition-colors"
          >
            Blog
          </Link>

          {/* Contact Accordion */}
          <div className="border-b border-[var(--color-border-default)]/50 pb-[var(--spacing-2)]">
            <button
              type="button"
              onClick={() => setMobileContactOpen(!mobileContactOpen)}
              className="w-full flex items-center justify-between text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] py-[var(--spacing-2)] text-left cursor-pointer"
            >
              <span>Contact</span>
              <ChevronDown
                className={`w-6 h-6 transition-transform duration-200 text-[var(--color-text-secondary)] ${
                  mobileContactOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Expandable Mobile Links */}
            {mobileContactOpen && (
              <ul className="flex flex-col gap-[var(--spacing-3)] pt-[var(--spacing-3)] pb-[var(--spacing-2)] pl-[var(--spacing-2)]">
                {contactLinks.map((item) => (
                  <li key={item.label}>
                    {item.isCopy ? (
                      <button
                        type="button"
                        onClick={() => item.copyValue && handleCopy(item.copyValue)}
                        className="flex items-center justify-between w-full text-[length:var(--text-body-m)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-1 text-left"
                      >
                        <span>{copied ? "Copied!" : item.label}</span>
                        {copied ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 opacity-60" />
                        )}
                      </button>
                    ) : (
                      <a
                        href={item.href}
                        target={item.external ? "_blank" : undefined}
                        rel={item.external ? "noopener noreferrer" : undefined}
                        download={item.isDownload ? true : undefined}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-between text-[length:var(--text-body-m)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors py-1"
                      >
                        <span>{item.label}</span>
                        {item.external && (
                          <ExternalLink className="w-4 h-4 opacity-60" />
                        )}
                        {item.isDownload && (
                          <Download className="w-4 h-4 opacity-60" />
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}