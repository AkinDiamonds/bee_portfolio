// src/app/admin/forms/TechForm.tsx
"use client";

import { useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { TechCategoryDoc } from "@/lib/types";

interface TechFormProps {
  initial: TechCategoryDoc[];
}

export default function TechForm({ initial }: TechFormProps) {
  const { authHeader } = useAdminAuth();

  const [techState, setTechState] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {
      frontend: "",
      "backend-devops": "",
      "ai-engineering": "",
    };
    (initial || []).forEach((doc) => {
      if (doc.category === "Frontend" || doc.id === "frontend") {
        state.frontend = (doc.items || []).join(", ");
      }
      if (doc.category === "Backend & DevOps" || doc.id === "backend-devops") {
        state["backend-devops"] = (doc.items || []).join(", ");
      }
      if (doc.category === "AI Engineering" || doc.id === "ai-engineering") {
        state["ai-engineering"] = (doc.items || []).join(", ");
      }
    });
    return state;
  });

  const [status, setStatus] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving…");

    const payload = {
      frontend: techState.frontend
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      backendDevops: techState["backend-devops"]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      aiEngineering: techState["ai-engineering"]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/admin/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("Technologies saved successfully!");
    } catch {
      setStatus("Error saving technologies.");
    }
  };

  const textareaClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] p-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-[var(--spacing-6)] border-t border-[var(--color-border-default)] pt-[var(--spacing-8)]">
      <div>
        <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          Technologies
        </h2>
        <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
          Manage skills and technology stack columns (comma-separated items).
        </p>
      </div>

      <div className="flex flex-col gap-[var(--spacing-2)]">
        <label
          htmlFor="tech-frontend"
          className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
        >
          Frontend (comma-separated)
        </label>
        <textarea
          id="tech-frontend"
          rows={3}
          value={techState.frontend}
          onChange={(e) => setTechState((p) => ({ ...p, frontend: e.target.value }))}
          placeholder="React, Next.js, TypeScript, Tailwind CSS, WebGL..."
          className={textareaClass}
        />
      </div>

      <div className="flex flex-col gap-[var(--spacing-2)]">
        <label
          htmlFor="tech-backend"
          className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
        >
          Backend &amp; DevOps (comma-separated)
        </label>
        <textarea
          id="tech-backend"
          rows={3}
          value={techState["backend-devops"]}
          onChange={(e) => setTechState((p) => ({ ...p, "backend-devops": e.target.value }))}
          placeholder="Node.js, Python, PostgreSQL, Docker, Redis, Firebase..."
          className={textareaClass}
        />
      </div>

      <div className="flex flex-col gap-[var(--spacing-2)]">
        <label
          htmlFor="tech-ai"
          className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
        >
          AI Engineering (comma-separated)
        </label>
        <textarea
          id="tech-ai"
          rows={3}
          value={techState["ai-engineering"]}
          onChange={(e) => setTechState((p) => ({ ...p, "ai-engineering": e.target.value }))}
          placeholder="LangChain, OpenAI API, Gemini SDK, Vector DBs, RAG Systems..."
          className={textareaClass}
        />
      </div>

      <div className="flex items-center gap-[var(--spacing-4)]">
        <button
          type="submit"
          className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Save Technologies
        </button>
        {status && (
          <span className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-muted)]">
            {status}
          </span>
        )}
      </div>
    </form>
  );
}
