// src/app/admin/forms/ProjectsForm.tsx
"use client";

import { useState, useRef } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { ProjectDoc } from "@/lib/types";

interface ProjectsFormProps {
  initial: ProjectDoc[];
}

const emptyProject: ProjectDoc = {
  slug: "",
  title: "",
  summary: "",
  description: "",
  tags: [],
  type: "Frontend & AI",
  demoUrl: "",
  demoType: "image",
  metrics: [],
  workplace: false,
  visibility: true,
  order: 0,
};

export default function ProjectsForm({ initial }: ProjectsFormProps) {
  const { authHeader } = useAdminAuth();
  const [projects, setProjects] = useState<ProjectDoc[]>(initial ?? []);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectDoc>(emptyProject);
  const [tagsInput, setTagsInput] = useState("");
  const [metricsInput, setMetricsInput] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const startEdit = (proj: ProjectDoc) => {
    setEditingSlug(proj.slug);
    setFormData(proj);
    setTagsInput(proj.tags?.join(", ") || "");
    setMetricsInput(proj.metrics?.join("\n") || "");
    setStatus("");
  };

  const startNew = () => {
    const newOrder = projects.length > 0 ? Math.max(...projects.map((p) => p.order || 0)) + 1 : 1;
    setEditingSlug("NEW");
    setFormData({ ...emptyProject, order: newOrder });
    setTagsInput("");
    setMetricsInput("");
    setStatus("");
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setStatus("");
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData.slug) {
      setStatus("Please enter a slug before uploading media.");
      return;
    }

    setUploading(true);
    setStatus("Uploading media…");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", formData.slug);

      const res = await fetch("/api/admin/projects/upload", {
        method: "POST",
        headers: { Authorization: authHeader },
        body: fd,
      });

      const data = (await res.json()) as { url?: string; demoType?: "image" | "video"; error?: string };
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          demoUrl: data.url,
          demoType: data.demoType || "image",
        }));
        setStatus("Media uploaded successfully!");
      } else {
        setStatus(`Upload error: ${data.error ?? "failed"}`);
      }
    } catch {
      setStatus("Network error uploading media.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug.trim() || !formData.title.trim()) {
      setStatus("Slug and Title are required.");
      return;
    }

    setStatus("Saving project…");
    const payload: ProjectDoc = {
      ...formData,
      slug: formData.slug.trim(),
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      metrics: metricsInput.split("\n").map((m) => m.trim()).filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setProjects((prev) => {
          const index = prev.findIndex((p) => p.slug === payload.slug);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = payload;
            return updated.sort((a, b) => (a.order || 0) - (b.order || 0));
          }
          return [...prev, payload].sort((a, b) => (a.order || 0) - (b.order || 0));
        });
        setEditingSlug(null);
        setStatus("Project saved!");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(`Error: ${data.error || res.statusText}`);
      }
    } catch {
      setStatus("Network error saving project.");
    }
  };

  const handleDelete = async (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete project "${slug}"?`)) return;

    setStatus("Deleting project…");
    try {
      const res = await fetch("/api/admin/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({ slug }),
      });

      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.slug !== slug));
        if (editingSlug === slug) setEditingSlug(null);
        setStatus("Project deleted.");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus(`Error: ${data.error || res.statusText}`);
      }
    } catch {
      setStatus("Network error deleting project.");
    }
  };

  const inputClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  return (
    <section className="flex flex-col gap-[var(--spacing-6)] border-t border-[var(--color-border-default)] pt-[var(--spacing-8)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Projects
          </h2>
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
            Manage portfolio featured projects and case studies.
          </p>
        </div>
        {!editingSlug && (
          <button
            type="button"
            onClick={startNew}
            className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            + Add Project
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
              {editingSlug === "NEW" ? "New Project" : `Edit: ${formData.title}`}
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
                Project Title *
              </label>
              <input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                className={`${inputClass} disabled:opacity-50`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
              Short Summary (used in cards / preview)
            </label>
            <input
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
              Full Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Type / Domain
              </label>
              <input
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Time Taken (e.g. &quot;3 weeks&quot;)
              </label>
              <input
                value={formData.timeTaken || ""}
                onChange={(e) => setFormData({ ...formData, timeTaken: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
              Tags (comma-separated, e.g. &quot;Next.js, TypeScript, OpenAI&quot;)
            </label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
              Key Metrics (one per line)
            </label>
            <textarea
              rows={2}
              value={metricsInput}
              onChange={(e) => setMetricsInput(e.target.value)}
              placeholder="99.9% uptime&#10;50k+ active users"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={formData.githubUrl || ""}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Live URL
              </label>
              <input
                type="url"
                value={formData.liveUrl || ""}
                onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Docs URL
              </label>
              <input
                type="url"
                value={formData.docsUrl || ""}
                onChange={(e) => setFormData({ ...formData, docsUrl: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          {/* Media upload */}
          <div className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-sm)] flex flex-col gap-[var(--spacing-2)]">
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
              Demo Media (Image or Video)
            </label>
            {formData.demoUrl && (
              <p className="text-[length:var(--text-caption)] text-[var(--color-text-muted)] break-all">
                Current ({formData.demoType}): {formData.demoUrl}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading || !formData.slug}
                className="w-fit border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-default)] disabled:opacity-50 cursor-pointer"
              >
                {uploading ? "Uploading…" : "Upload Media File"}
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*,video/mp4,video/webm"
                className="hidden"
                onChange={handleMediaUpload}
              />
              <span className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                Accepts MP4/WebM or PNG/JPG (max 50MB)
              </span>
            </div>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-6 pt-2">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.visibility}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.checked })}
                className="rounded border-[var(--color-border-default)]"
              />
              <span className="text-[length:var(--text-body-s)] text-[var(--color-text-primary)]">
                Visible on Portfolio
              </span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.workplace}
                onChange={(e) => setFormData({ ...formData, workplace: e.target.checked })}
                className="rounded border-[var(--color-border-default)]"
              />
              <span className="text-[length:var(--text-body-s)] text-[var(--color-text-primary)]">
                Workplace Project (hide public source)
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border-default)]">
            <button
              type="submit"
              className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Save Project
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

      {/* Projects List */}
      <div className="flex flex-col gap-[var(--spacing-3)]">
        {projects.length === 0 ? (
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] italic">
            No projects added yet. Click &quot;+ Add Project&quot; above to create one.
          </p>
        ) : (
          projects.map((proj) => (
            <div
              key={proj.slug}
              className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)] flex items-center justify-between gap-4 bg-[var(--color-background-default)] hover:border-[var(--color-neutral-300)] transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-[number:var(--font-weight-medium)] text-[length:var(--text-body-m)] text-[var(--color-text-primary)] truncate">
                    {proj.title}
                  </h3>
                  {!proj.visibility && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--color-neutral-100)] text-[var(--color-text-muted)]">
                      Hidden
                    </span>
                  )}
                </div>
                <p className="text-[length:var(--text-body-s)] text-[var(--color-text-secondary)] truncate">
                  {proj.summary || proj.description || "No summary"}
                </p>
                <span className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                  slug: <code className="font-mono">{proj.slug}</code> · order: {proj.order} · tags: {proj.tags?.join(", ") || "none"}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(proj)}
                  className="px-3 py-1.5 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(proj.slug)}
                  className="px-3 py-1.5 border border-red-200 text-red-600 rounded-[var(--radius-sm)] text-[length:var(--text-body-s)] hover:bg-red-50 cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
