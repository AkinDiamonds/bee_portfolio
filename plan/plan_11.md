# plan_11 — Blog Admin + Frontend Wiring

**Goal:** Build the Blog admin tab, integrating a Tiptap rich-text editor for writing posts. Then wire up the `LatestBlogs` home page component, the `/blog` list page, and the `/blog/[slug]` detail page to pull from Firestore and render the HTML.

**Prerequisite:** plan_10 complete.

---

## Part A — Admin: BlogTab & TiptapEditor

### Create `src/components/admin/TiptapEditor.tsx`

Install Tiptap if not already installed (you can check package.json or install via `npm i @tiptap/react @tiptap/starter-kit`).

```tsx
// src/components/admin/TiptapEditor.tsx
"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] border border-[var(--color-border-default)] rounded-[var(--radius-md)] p-[var(--spacing-4)]',
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-[var(--spacing-2)]">
      {/* Basic toolbar */}
      <div className="flex gap-[var(--spacing-2)] flex-wrap border border-[var(--color-border-default)] p-[var(--spacing-2)] rounded-[var(--radius-md)] bg-[var(--color-background-subtle)]">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-[var(--spacing-3)] py-[var(--spacing-1)] rounded ${editor.isActive('bold') ? 'bg-[var(--color-border-default)]' : ''}`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-[var(--spacing-3)] py-[var(--spacing-1)] rounded ${editor.isActive('italic') ? 'bg-[var(--color-border-default)]' : ''}`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-[var(--spacing-3)] py-[var(--spacing-1)] rounded ${editor.isActive('heading', { level: 2 }) ? 'bg-[var(--color-border-default)]' : ''}`}
        >
          H2
        </button>
        {/* Add more as needed: H3, blockquote, codeBlock, etc. */}
      </div>
      
      <EditorContent editor={editor} />
    </div>
  );
}
```

### Update `src/app/admin/tabs/BlogTab.tsx`

Build the UI to list all posts and an editor view to create/edit a post.

```tsx
// src/app/admin/tabs/BlogTab.tsx
"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import TiptapEditor from "@/components/admin/TiptapEditor";
import type { BlogPostDoc } from "@/lib/types";

export default function BlogTab() {
  const { authHeader } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPostDoc[]>([]);
  // ... state for editing a post, saving, deleting ...
  
  // Example of saving: POST to `/api/admin/posts`
  
  return (
    <section className="py-[var(--spacing-6)]">
      {/* List posts on the left/top, editor on the right/bottom */}
      {/* When editing a post, render: */}
      {/* <TiptapEditor content={editingPost.body} onChange={(html) => setEditingPost({ ...editingPost, body: html })} /> */}
    </section>
  );
}
```

---

## Part B — Frontend Wiring

### Update `src/components/blog/LatestBlogs.tsx`

Modify it to accept a `posts` prop (pass the top 5 from the page).

```tsx
// src/components/blog/LatestBlogs.tsx
import Link from "next/link";
import type { BlogPostDoc } from "@/lib/types";

interface LatestBlogsProps {
  posts: BlogPostDoc[];
}

export default function LatestBlogs({ posts }: LatestBlogsProps) {
  // Only show visible posts
  const visible = posts.filter(p => p.visibility);
  
  return (
    <section className="py-[var(--spacing-section)]">
      <div className="flex justify-between items-center mb-[var(--spacing-6)]">
        <h2 className="text-[length:var(--text-heading-h2)] font-[number:var(--font-weight-semibold)]">Latest Blogs</h2>
        <Link href="/blog" className="px-[var(--spacing-4)] py-[var(--spacing-2)] rounded-[var(--radius-pill)] border border-[var(--color-border-default)] hover:bg-[var(--color-background-subtle)] transition-colors text-[length:var(--text-label)] font-[number:var(--font-weight-medium)]">
          View blog
        </Link>
      </div>
      
      {/* Render horizontal scroll row of cards (no cover image as per AGENTS.md, dark tile with text) */}
      <div className="flex overflow-x-auto gap-[var(--spacing-6)] pb-[var(--spacing-4)] snap-x">
        {visible.map(post => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="snap-start shrink-0 w-[300px] h-[350px] bg-[var(--color-neutral-900)] text-[var(--color-neutral-0)] rounded-[var(--radius-lg)] p-[var(--spacing-5)] flex flex-col justify-between group">
            <h3 className="text-[length:var(--text-heading-h3)] font-[number:var(--font-weight-bold)] group-hover:text-[var(--color-accent-primary)] transition-colors">
              {post.title}
            </h3>
            <div>
              <p className="text-[length:var(--text-caption)] text-[var(--color-neutral-300)] opacity-70 mb-[var(--spacing-2)]">
                {new Date(post.publishedAt).toLocaleDateString()} · {post.category}
              </p>
              <span className="text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] flex items-center gap-1 group-hover:gap-2 transition-all">
                Read blog <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

### Update `src/app/blog/page.tsx`

Fetch all visible posts and render them.

```tsx
import { getPosts } from "@/lib/firestore";
import Link from "next/link";

export default async function BlogListPage() {
  const posts = await getPosts();
  const visible = posts.filter(p => p.visibility).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  
  return (
    <main className="max-w-[var(--container-portfolio)] mx-auto px-[var(--spacing-5)] py-[var(--spacing-8)]">
       <h1 className="text-[length:var(--text-heading-h1)] font-[number:var(--font-weight-bold)] mb-[var(--spacing-8)]">Blog</h1>
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[var(--spacing-6)]">
         {/* Render cards similar to LatestBlogs */}
       </div>
    </main>
  );
}
```

### Update `src/app/blog/[slug]/page.tsx`

Fetch single post, sanitize HTML, and render.

```tsx
import { getPostBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  
  if (!post || !post.visibility) {
    notFound();
  }

  // Sanitize the HTML string using the config from convention.md
  const safeBody = sanitizeHtml(post.body, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'u', 'mark', 'pre', 'code']),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      '*': ['style', 'class'],
      a: ['href', 'target', 'rel'],
    },
  });

  return (
    <article className="max-w-[800px] mx-auto px-[var(--spacing-5)] py-[var(--spacing-8)]">
      <header className="mb-[var(--spacing-8)] border-b border-[var(--color-border-default)] pb-[var(--spacing-6)]">
        <h1 className="text-[length:var(--text-display-l)] font-[number:var(--font-weight-bold)] mb-[var(--spacing-4)] leading-tight">{post.title}</h1>
        <div className="flex gap-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
           <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
           <span>·</span>
           <span>{post.category}</span>
        </div>
      </header>
      
      <div 
        className="prose prose-lg dark:prose-invert max-w-none" 
        dangerouslySetInnerHTML={{ __html: safeBody }} 
      />
    </article>
  );
}
```

---

## Verification
Run `npm run build`, `npm run lint`, `npx tsc --noEmit`. Ensure they pass.
