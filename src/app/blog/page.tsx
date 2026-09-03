import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPosts } from "@/lib/content";
import styles from "./BlogPage.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on product engineering, systems, and AI.",
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <h1 className={styles.title}>Blog</h1>
        <div className={styles.list}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.post}>
              <p className={styles.meta}>{post.date} · {post.category}</p>
              <h2 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readLink}>Read article →</Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
