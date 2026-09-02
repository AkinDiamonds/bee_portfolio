"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BlogPostData } from "@/lib/content";

interface LatestBlogsProps {
  posts: BlogPostData[];
}

export default function LatestBlogs({ posts }: LatestBlogsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
    }
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [posts]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const distance = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -distance : distance,
      behavior: "smooth",
    });
  };

  if (!posts || posts.length === 0) return null;

  return (
    <section
      id="blog"
      aria-label="Latest Blogs"
      className="py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between mb-[var(--spacing-6)] md:mb-[var(--spacing-8)]">
        <h2 className="text-[length:var(--text-heading-h3)] md:text-[length:var(--text-heading-h2)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-heading)]">
          Latest Blogs
        </h2>
        <Link
          href="/blog"
          className="inline-flex items-center justify-center rounded-full px-[var(--spacing-5)] py-[var(--spacing-2)] bg-[var(--color-neutral-100)] hover:bg-[var(--color-neutral-200)] text-[var(--color-text-primary)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] transition-colors active:scale-95"
        >
          View blog
        </Link>
      </div>

      {/* Horizontal Scroll Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-4 pt-2 scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <article
            key={post.slug}
            className="w-[280px] sm:w-[320px] shrink-0 flex flex-col group"
          >
            {/* Tile Thumbnail */}
            <div className="aspect-[4/3] rounded-[var(--radius-md)] bg-gradient-to-br from-[var(--color-neutral-900)] to-[var(--color-neutral-950)] text-[var(--color-neutral-0)] p-6 relative overflow-hidden flex flex-col justify-end shadow-sm group-hover:shadow-md transition-all duration-300">
              <div className="relative z-10">
                <span className="text-xl md:text-2xl font-bold leading-tight drop-shadow-sm text-balance block">
                  {post.title}
                </span>
              </div>
            </div>

            {/* Post Metadata & Details */}
            <div className="mt-4 flex flex-col flex-1">
              <h3 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] transition-colors line-clamp-2 leading-snug">
                {post.title}
              </h3>
              <p className="mt-2 text-[length:var(--text-caption)] text-[var(--color-text-muted)] font-[number:var(--font-weight-medium)]">
                {post.date} {post.category ? `· ${post.category}` : ""}
              </p>
              <div className="mt-3">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-1 text-[length:var(--text-body-xs)] font-[number:var(--font-weight-small)] text-[var(--color-text-muted)] hover:text-[var(--color-bee-accent)] hover:opacity-80 transition-opacity"
                >
                  Read blog <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation Arrows (Desktop) */}
      <div className="mt-6 hidden md:flex items-center gap-2">
        <button
          onClick={() => handleScroll("left")}
          disabled={!canScrollLeft}
          aria-label="Previous blog posts"
          className="w-10 h-10 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-200)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleScroll("right")}
          disabled={!canScrollRight}
          aria-label="Next blog posts"
          className="w-10 h-10 rounded-full bg-[var(--color-neutral-100)] flex items-center justify-center text-[var(--color-text-primary)] hover:bg-[var(--color-neutral-200)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
