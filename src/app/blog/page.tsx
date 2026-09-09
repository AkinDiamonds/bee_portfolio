import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/nav/Navbar";
import { getBlogPosts, getSiteProfile } from "@/lib/firestore";
import styles from "./BlogPage.module.css";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on product engineering, systems, and AI.",
};

export default async function BlogIndexPage() {
  const [posts, profile] = await Promise.all([
    getBlogPosts(undefined, true),
    getSiteProfile(),
  ]);

  return (
    <div className={styles.page}>
      <Navbar profile={profile} />
      <main className={styles.main}>
        <h1 className={styles.title}>Blog</h1>
        <div className={styles.list}>
          {posts.map((post) => (
            <article key={post.slug} className={styles.post}>
              <p className={styles.meta}>{post.publishedAt} · {post.category}</p>
              <h2 className={styles.postTitle}>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className={styles.excerpt}>{post.excerpt}</p>
              <Link href={`/blog/${post.slug}`} className={styles.readLink}>Read article →</Link>
            </article>
          ))}
          {posts.length === 0 && (
            <p className={styles.excerpt}>No posts published yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
