import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Blog",
  description: "TODO: Approved blog archive description.",
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]">
        <h1 className="text-[length:var(--text-heading-h1)] leading-[var(--text-heading-h1--line-height)] font-[number:var(--font-weight-bold)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-8)]">
          Blog
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-6)]">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-[var(--color-border-default)] rounded-[var(--radius-lg)] p-[var(--spacing-6)] flex flex-col justify-between"
            >
              <div>
                <div className="text-[length:var(--text-caption)] text-[var(--color-text-muted)] mb-[var(--spacing-2)]">
                  {post.date} · {post.category}
                </div>
                <h2 className="text-[length:var(--text-heading-h3)] leading-[var(--text-heading-h3--line-height)] font-[number:var(--font-weight-semibold)] mb-[var(--spacing-3)]">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:underline focus-visible:outline-2 focus-visible:outline-[var(--color-text-primary)] rounded-[var(--radius-sm)]"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-[length:var(--text-body-m)] text-[var(--color-text-secondary)] mb-[var(--spacing-5)]">
                  {post.excerpt}
                </p>
              </div>
              <Link
                href={`/blog/${post.slug}`}
                className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)] hover:underline inline-flex items-center gap-[var(--spacing-1)]"
              >
                Read post →
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
