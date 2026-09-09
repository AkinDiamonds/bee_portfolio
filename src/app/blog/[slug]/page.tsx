import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPostBySlug, getSiteProfile } from "@/lib/firestore";
import styles from "../BlogPage.module.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getBlogPostBySlug(slug),
    getSiteProfile(),
  ]);

  if (!post || !post.visibility) notFound();

  return (
    <div className={styles.page}>
      <Navbar profile={profile} />
      <main className={styles.main}>
        <Link href="/blog" className={styles.backLink}>← Back to blog</Link>
        <article className={styles.article}>
          <p className={styles.meta}>{post.publishedAt} · {post.category}</p>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        </article>
      </main>
    </div>
  );
}
