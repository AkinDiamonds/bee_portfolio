import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPostBySlug, getSiteProfile } from "@/lib/firestore";
import sanitizeHtml from "sanitize-html";
import styles from "../BlogPage.module.css";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Simeon Akinrinola`,
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

  const safeBody = sanitizeHtml(post.body || "", {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      "h1",
      "h2",
      "h3",
      "u",
      "mark",
      "pre",
      "code",
      "img",
      "span",
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      "*": ["style", "class"],
      a: ["href", "target", "rel"],
      img: ["src", "alt", "width", "height"],
    },
  });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://simeon.dev";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: profile?.heroName || "Simeon Akinrinola",
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      name: profile?.heroName || "Simeon Akinrinola",
    },
    articleSection: post.category,
    keywords: post.category,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
  };

  return (
    <div className={styles.page}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar profile={profile} />
      <main className={styles.main}>
        <Link href="/blog" className={styles.backLink}>← Back to blog</Link>
        <article className={styles.article}>
          <p className={styles.meta}>{post.publishedAt} · {post.category}</p>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div
            className={styles.content}
            dangerouslySetInnerHTML={{ __html: safeBody }}
          />
        </article>
      </main>
    </div>
  );
}
