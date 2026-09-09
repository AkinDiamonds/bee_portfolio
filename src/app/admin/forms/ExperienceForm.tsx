// src/app/admin/forms/ExperienceForm.tsx
"use client";

import { useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { ExperienceDoc } from "@/lib/types";

interface ExperienceFormProps {
  initial: ExperienceDoc[];
}

const emptyExperience: ExperienceDoc = {
  id: "",
  role: "",
  company: "",
  startDate: "",
  endDate: "",
};

export default function ExperienceForm({ initial }: ExperienceFormProps) {
  const { authHeader } = useAdminAuth();
  const [experiences, setExperiences] = useState<ExperienceDoc[]>(initial ?? []);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ExperienceDoc>(emptyExperience);
  const [status, setStatus] = useState("");

  const startNew = () => {
    setEditingId("NEW");
    setFormData(emptyExperience);
    setStatus("");
  };

  const startEdit = (item: ExperienceDoc) => {
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
    if (!formData.role.trim() || !formData.company.trim() || !formData.startDate.trim()) {
      setStatus("Role, Company, and Start Date are required.");
      return;
    }

    setStatus("Saving experience…");
    try {
      const payload: ExperienceDoc = {
        ...formData,
        id: editingId === "NEW" ? "" : formData.id,
      };

      const res = await fetch("/api/admin/experience", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { success?: boolean; id?: string; error?: string };

      if (res.ok && data.id) {
        const savedItem: ExperienceDoc = { ...payload, id: data.id };
        setExperiences((prev) => {
          const index = prev.findIndex((x) => x.id === data.id);
          if (index >= 0) {
            const copy = [...prev];
            copy[index] = savedItem;
            return copy.sort((a, b) => b.startDate.localeCompare(a.startDate));
          }
          return [...prev, savedItem].sort((a, b) => b.startDate.localeCompare(a.startDate));
        });
        setEditingId(null);
        setStatus("Experience saved!");
      } else {
        setStatus(`Error: ${data.error || "Save failed"}`);
      }
    } catch {
      setStatus("Network error saving experience.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this experience entry?")) return;

    setStatus("Deleting experience…");
    try {
      const res = await fetch("/api/admin/experience", {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setExperiences((prev) => prev.filter((x) => x.id !== id));
        if (editingId === id) setEditingId(null);
        setStatus("Experience deleted.");
      } else {
        setStatus("Failed to delete experience.");
      }
    } catch {
      setStatus("Network error deleting experience.");
    }
  };

  const inputClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  return (
    <section className="flex flex-col gap-[var(--spacing-6)] border-t border-[var(--color-border-default)] pt-[var(--spacing-8)]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Work Experience
          </h2>
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
            Manage roles, employers, and employment timelines.
          </p>
        </div>
        {!editingId && (
          <button
            type="button"
            onClick={startNew}
            className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-2)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
          >
            + Add Experience
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
              {editingId === "NEW" ? "Add Work Experience" : `Edit: ${formData.role} at ${formData.company}`}
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
                Role / Title *
              </label>
              <input
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="Senior Full Stack Engineer"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Company / Organization *
              </label>
              <input
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company Name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-4)]">
            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                Start Date * (e.g. &quot;Jan 2023&quot; or &quot;2023&quot;)
              </label>
              <input
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="Jan 2023"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-1">
                End Date (leave blank or &quot;Present&quot; if current)
              </label>
              <input
                value={formData.endDate || ""}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="Present"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border-default)]">
            <button
              type="submit"
              className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
            >
              Save Experience
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

      {/* Experience List */}
      <div className="flex flex-col gap-[var(--spacing-3)]">
        {experiences.length === 0 ? (
          <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] italic">
            No work experience added yet. Click &quot;+ Add Experience&quot; above to create one.
          </p>
        ) : (
          experiences.map((exp) => (
            <div
              key={exp.id}
              className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)] flex items-center justify-between gap-4 bg-[var(--color-background-default)] hover:border-[var(--color-neutral-300)] transition-colors"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <h3 className="font-[number:var(--font-weight-semibold)] text-[length:var(--text-body-m)] text-[var(--color-text-primary)] truncate">
                  {exp.role} <span className="font-normal text-[var(--color-text-secondary)]">at {exp.company}</span>
                </h3>
                <span className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">
                  {exp.startDate} — {exp.endDate || "Present"}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => startEdit(exp)}
                  className="px-3 py-1.5 border border-[var(--color-border-default)] rounded-[var(--radius-sm)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] hover:bg-[var(--color-background-subtle)] cursor-pointer"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(exp.id)}
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
