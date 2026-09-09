// src/app/admin/tabs/BlogTab.tsx
"use client";

import { useState, useEffect } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import TiptapEditor from "@/components/admin/TiptapEditor";
import type { BlogPostDoc } from "@/lib/types";

const emptyPost: BlogPostDoc = {
  slug: "",
  title: "",
  category: "Engineering",
  excerpt: "",
  body: "<p>Write your article here...</p>",
  publishedAt: new Date().toISOString().split("T")[0],
  visibility: true,
};

export default function BlogTab() {
  const { authHeader } = useAdminAuth();
  const [posts, setPosts] = useState<BlogPostDoc[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogPostDoc>(emptyPost);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/posts-read", { headers: { Authorization: authHeader } })
      .then((r) => r.json())
      .then((data: BlogPostDoc[]) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoaded(true));
  }, [authHeader]);

  const startNew = () => {
    setEditingSlug("NEW");
    setFormData({
      ...emptyPost,
      publishedAt: new Date().toISOString().split("T")[0],
    });
    setStatus("");
  };

  const startEdit = (post: BlogPostDoc) => {
    setEditingSlug(post.slug);
    setFormData(post);
    setStatus("");
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setStatus("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.slug.trim() || !formData.body.trim()) {
      setStatus("Title, slug, and content body are required.");
      return;
    }

    setStatus("Saving post…");
    const payload: BlogPostDoc = {
      ...formData,
      slug: formData.slug.trim(),
    };

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setPosts((prev) => {
          const index = prev.findIndex((p) => p.slug === payload.slug);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = payload;
            return updated.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
          }
          return [payload, ...prev].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        });
        setEditingSlug(null);
        setStatus("Blog post saved!");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(`Error: ${data.error || res.statusText}`);
      }
    } catch {
      setStatus("Network error saving post.");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete post "${slug}"?`)) return;

    setStatus("Deleting post…");
    try {
      const res = await fetch("/api/admin/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.slug !== slug));
        if (editingSlug === slug) setEditingSlug(null);
        setStatus("Post deleted.");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(`Error: ${data.error || res.statusText}`);
      }
    } catch {
      setStatus("Network error deleting post.");
    }
  };

  const inputClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  if (!loaded) {
    return (
      <p className="py-[var(--spacing-6)] text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
        Loading posts…
      </p>
    );
  }

  return (
    <div className="py-[var(--spacing-6)] flex flex-col gap-[var(--spacing-6)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Blog Articles
          </h2>
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
            Publish technical writeups, systems engineering thoughts, and essays.
          </p>
        </div>
        {!editingSlug && (
          <button
            type="button"
            onClick={startNew}
            className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            + New Post
          </button>
        )}
      </div>

      {status && (
        <p role="status" className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-accent-primary)]">
          {status}
        </p>
      )}

      {/* Editor Modal / Form */}
      {editingSlug && (
        <form onSubmit={handleSave} className="border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] p-[var(--spacing-6)] rounded-[var(--radius-md)] flex flex-col gap-[var(--spacing-4)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-[var(--spacing-3)]">
            <h3 className="font-[number:var(--font-weight-semibold)] text-[length:var(--text-heading-h4)] text-[var(--color-text-primary)]">
              {editingSlug === "NEW" ? "New Blog Post" : `Edit: ${formData.title}`}
            </h3>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Post Title *
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Building Scalable Systems"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Slug (URL identifier) *
              </label>
              <input
                required
                disabled={editingSlug !== "NEW"}
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })}
                placeholder="building-scalable-systems"
                className={`${inputClass} disabled:opacity-50`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Category
              </label>
              <input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="AI Engineering, Architecture, Product..."
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Publish Date (YYYY-MM-DD)
              </label>
              <input
                type="date"
                value={formData.publishedAt}
                onChange={(e) => setFormData({ ...formData, publishedAt: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
              Short Excerpt / Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief summary of what this article covers..."
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-2">
              Article Content (Rich Text) *
            </label>
            <TiptapEditor
              content={formData.body}
              onChange={(html) => setFormData((prev) => ({ ...prev, body: html }))}
            />
          </div>

          <div className="pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
                className="rounded border-[var(--color-border-default)]"
              />
              <span className="text-[length:var(--text-body-s)] text-[var(--color-text-primary)]">
                Visible / Published
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border-default)]">
            <button
              type="submit"
              className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Save Post
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-5)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-default)] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Posts List */}
      <div className="flex flex-col gap-[var(--spacing-3)]">
        {posts.length === 0 ? (
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] italic">
            No blog posts published yet. Click &quot;+ New Post&quot; above to create your first article.
          </p>
        ) : (
          posts.map((post) => (
            <div
              key={post.slug}
              className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)] flex items-center justify-between gap-4 bg-[var(--color-background-default)] hover:border-[var(--color-neutral-300)] transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-[number:var(--font-weight-semibold)] text-[length:var(--text-body-m)] text-[var(--color-text-primary)] truncate">
                    {post.title}
                  </h3>
                  {!post.visibility && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--color-neutral-100)] text-[var(--color-text-muted)]">
                      Draft / Hidden
                    </span>
                  )}
                </div>
                <p className="text-[length:var(--text-body-s)] text-[var(--color-text-secondary)] truncate">
                  {post.excerpt || "No excerpt"}
                </p>
                <span className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                  {post.publishedAt} · {post.category || "General"} · slug: <code className="font-mono">{post.slug}</code>
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(post)}
                  className="px-3 py-1.5 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-[var(--radius-sm)] text-[length:var(--text-body-s)] hover:bg-red-50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
