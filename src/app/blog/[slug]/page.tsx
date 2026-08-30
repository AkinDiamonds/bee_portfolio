import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/nav/Navbar";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)]">
        <Link
          href="/blog"
          className="inline-block text-[length:var(--text-label)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] mb-[var(--spacing-6)]"
        >
          ← Back to Blog
        </Link>
        <article className="max-w-3xl">
          <div className="text-[length:var(--text-caption)] text-[var(--color-text-muted)] mb-[var(--spacing-2)]">
            {post.date} · {post.category}
          </div>
          <h1 className="text-[length:var(--text-heading-h1)] leading-[var(--text-heading-h1--line-height)] font-[number:var(--font-weight-bold)] tracking-[var(--tracking-tight-heading)] mb-[var(--spacing-6)]">
            {post.title}
          </h1>
          <div className="text-[length:var(--text-body-l)] leading-[var(--text-body-l--line-height)] text-[var(--color-text-secondary)] whitespace-pre-line">
            {post.content || post.excerpt}
          </div>
        </article>
      </main>
    </div>
  );
}
