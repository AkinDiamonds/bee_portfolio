import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/content";
import styles from "../BlogPage.module.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = getBlogPostBySlug((await params).slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPostBySlug((await params).slug);
  if (!post) notFound();

  const paragraphs = (post.content || post.excerpt)
    .trim()
    .split(/\r?\n\s*\r?\n/)
    .filter((paragraph) => !paragraph.startsWith("#"));

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Link href="/blog" className={styles.backLink}>← Back to blog</Link>
        <article className={styles.article}>
          <p className={styles.meta}>{post.date} · {post.category}</p>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div className={styles.content}>
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
        </article>
      </main>
    </div>
  );
}
