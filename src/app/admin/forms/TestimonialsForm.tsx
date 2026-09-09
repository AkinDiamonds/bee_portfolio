// src/app/admin/forms/TestimonialsForm.tsx
"use client";

import { useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { TestimonialDoc } from "@/lib/types";

interface TestimonialsFormProps {
  initial: TestimonialDoc[];
}

const emptyTestimonial: TestimonialDoc = {
  id: "",
  quote: "",
  name: "",
  role: "",
  company: "",
  avatarUrl: "",
  visibility: true,
  order: 0,
};

export default function TestimonialsForm({ initial }: TestimonialsFormProps) {
  const { authHeader } = useAdminAuth();
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>(initial ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<TestimonialDoc>(emptyTestimonial);
  const [status, setStatus] = useState("");

  const startNew = () => {
    const newOrder = testimonials.length > 0 ? Math.max(...testimonials.map((t) => t.order || 0)) + 1 : 1;
    setEditingId("NEW");
    setFormData({ ...emptyTestimonial, order: newOrder });
    setStatus("");
  };

  const startEdit = (item: TestimonialDoc) => {
    setEditingId(item.id);
    setFormData(item);
    setStatus("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setStatus("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      setStatus("Name and Quote are required.");
      return;
    }

    setStatus("Saving testimonial…");
    try {
      const payload: TestimonialDoc = {
        ...formData,
        id: editingId === "NEW" ? "" : formData.id,
      };

      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { success?: boolean; id?: string; error?: string };

      if (res.ok && data.id) {
        const savedItem: TestimonialDoc = { ...payload, id: data.id };
        setTestimonials((prev) => {
          const index = prev.findIndex((x) => x.id === data.id);
          if (index >= 0) {
            const copy = [...prev];
            copy[index] = savedItem;
            return copy.sort((a, b) => (a.order || 0) - (b.order || 0));
          }
          return [...prev, savedItem].sort((a, b) => (a.order || 0) - (b.order || 0));
        });
        setEditingId(null);
        setStatus("Testimonial saved!");
      } else {
        setStatus(`Error: ${data.error || "Save failed"}`);
      }
    } catch {
      setStatus("Network error saving testimonial.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this testimonial?")) return;

    setStatus("Deleting testimonial…");
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setTestimonials((prev) => prev.filter((x) => x.id !== id));
        if (editingId === id) setEditingId(null);
        setStatus("Testimonial deleted.");
      } else {
        setStatus("Failed to delete testimonial.");
      }
    } catch {
      setStatus("Network error deleting testimonial.");
    }
  };

  const inputClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  return (
    <section className="flex flex-col gap-[var(--spacing-6)] border-t border-[var(--color-border-default)] pt-[var(--spacing-8)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Testimonials
          </h2>
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
            Manage peer and client endorsements and recommendations.
          </p>
        </div>
        {!editingId && (
          <button
            type="button"
            onClick={startNew}
            className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            + Add Testimonial
          </button>
        )}
      </div>

      {status && (
        <p role="status" className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-accent-primary)]">
          {status}
        </p>
      )}

      {/* Editor Form */}
      {editingId && (
        <form onSubmit={handleSave} className="border border-[var(--color-border-default)] bg-[var(--color-background-subtle)] p-[var(--spacing-6)] rounded-[var(--radius-md)] flex flex-col gap-[var(--spacing-4)]">
          <div className="flex items-center justify-between border-b border-[var(--color-border-default)] pb-[var(--spacing-3)]">
            <h3 className="font-[number:var(--font-weight-semibold)] text-[length:var(--text-heading-h4)] text-[var(--color-text-primary)]">
              {editingId === "NEW" ? "Add Testimonial" : `Edit: ${formData.name}`}
            </h3>
            <button
              type="button"
              onClick={cancelEdit}
              className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div>
            <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
              Quote / Recommendation *
            </label>
            <textarea
              required
              rows={4}
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              placeholder="&ldquo;Simeon is an exceptional engineer...&rdquo;"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Name *
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Jane Doe"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Role / Title
              </label>
              <input
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="CTO / Lead Architect"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Company
              </label>
              <input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Corp"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Avatar Image URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl || ""}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                placeholder="https://example.com/avatar.jpg"
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
                Visible on Portfolio
              </span>
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border-default)]">
            <button
              type="submit"
              className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Save Testimonial
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

      {/* Testimonials List */}
      <div className="flex flex-col gap-[var(--spacing-3)]">
        {testimonials.length === 0 ? (
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] italic">
            No testimonials added yet. Click &quot;+ Add Testimonial&quot; above to create one.
          </p>
        ) : (
          testimonials.map((t) => (
            <div
              key={t.id}
              className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)] flex items-start justify-between gap-4 bg-[var(--color-background-default)] hover:border-[var(--color-neutral-300)] transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-[number:var(--font-weight-semibold)] text-[length:var(--text-body-m)] text-[var(--color-text-primary)]">
                    {t.name}
                  </h3>
                  <span className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                    ({t.role}{t.company ? `, ${t.company}` : ""})
                  </span>
                  {!t.visibility && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[var(--color-neutral-100)] text-[var(--color-text-muted)]">
                      Hidden
                    </span>
                  )}
                </div>
                <blockquote className="text-[length:var(--text-body-s)] italic text-[var(--color-text-secondary)] line-clamp-2">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <span className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                  order: {t.order} {t.avatarUrl ? "· with avatar" : ""}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(t)}
                  className="px-3 py-1.5 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(t.id)}
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
