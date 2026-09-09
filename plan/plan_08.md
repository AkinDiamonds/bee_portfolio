# plan_08 — Technologies Form + TechStack Frontend Wiring

**Goal:** Build the Technologies admin form to manage the three tech categories ("Frontend", "Backend & DevOps", "AI Engineering"). Then wire up the `TechStack` frontend component to pull from Firestore instead of hardcoded data.

**Prerequisite:** plan_07 complete.

---

## Part A — Admin: TechForm

### Create `src/app/admin/forms/TechForm.tsx`

This form needs three sections for the three categories. Since `convention.md` says we only have exactly three document IDs: `frontend`, `backend-devops`, `ai-engineering`, the form can be hardcoded to manage exactly those three lists.

```tsx
// src/app/admin/forms/TechForm.tsx
"use client";

import { useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { TechnologyDoc } from "@/lib/types";

interface TechFormProps {
  initial: TechnologyDoc[];
}

export default function TechForm({ initial }: TechFormProps) {
  const { authHeader } = useAdminAuth();
  
  // Convert array to a keyed object for easier editing
  const [techState, setTechState] = useState<Record<string, string>>(() => {
    const state: Record<string, string> = {
      frontend: "",
      "backend-devops": "",
      "ai-engineering": "",
    };
    initial.forEach(doc => {
      // document ID maps to these categories roughly, or you can match on `doc.category`
      if (doc.category === 'Frontend') state.frontend = doc.items.join(", ");
      if (doc.category === 'Backend & DevOps') state["backend-devops"] = doc.items.join(", ");
      if (doc.category === 'AI Engineering') state["ai-engineering"] = doc.items.join(", ");
    });
    return state;
  });

  const [status, setStatus] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");
    // Convert comma-separated strings back to arrays
    const payload = [
      { id: "frontend", category: "Frontend", items: techState.frontend.split(",").map(s => s.trim()).filter(Boolean), order: 1 },
      { id: "backend-devops", category: "Backend & DevOps", items: techState["backend-devops"].split(",").map(s => s.trim()).filter(Boolean), order: 2 },
      { id: "ai-engineering", category: "AI Engineering", items: techState["ai-engineering"].split(",").map(s => s.trim()).filter(Boolean), order: 3 },
    ];

    try {
      const res = await fetch("/api/admin/technologies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify({ technologies: payload }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setStatus("Saved successfully!");
    } catch (error) {
      setStatus("Error saving.");
    }
  };

  return (
    <form onSubmit={handleSave} className="mt-[var(--spacing-8)] space-y-[var(--spacing-6)]">
      <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)]">Technologies</h2>
      
      {/* Build 3 textarea/inputs for the 3 categories */}
      <div>
        <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-2">Frontend (comma separated)</label>
        <textarea
          value={techState.frontend}
          onChange={(e) => setTechState(p => ({ ...p, frontend: e.target.value }))}
          className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] p-3"
        />
      </div>
      
      <div>
        <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-2">Backend & DevOps (comma separated)</label>
        <textarea
          value={techState["backend-devops"]}
          onChange={(e) => setTechState(p => ({ ...p, "backend-devops": e.target.value }))}
          className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] p-3"
        />
      </div>

      <div>
        <label className="block text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] mb-2">AI Engineering (comma separated)</label>
        <textarea
          value={techState["ai-engineering"]}
          onChange={(e) => setTechState(p => ({ ...p, "ai-engineering": e.target.value }))}
          className="w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] p-3"
        />
      </div>

      <div className="flex items-center gap-[var(--spacing-4)]">
        <button type="submit" className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)]">
          Save Technologies
        </button>
        {status && <span className="text-[length:var(--text-label)] text-[var(--color-text-muted)]">{status}</span>}
      </div>
    </form>
  );
}
```

### Update `src/app/admin/tabs/SiteDataTab.tsx`

Add `TechForm` to `SiteDataTab` and fetch the `TechnologyDoc[]` on mount using a new route like `/api/admin/technologies-read` (you can also just read them directly via a public API route or Server Component passing them down if preferred, but keeping consistency with the admin structure is good).

---

## Part B — Frontend Wiring

### Update `src/components/tech/TechStack.tsx`

Modify it to accept a `technologies` prop.

```tsx
// src/components/tech/TechStack.tsx
import type { TechnologyDoc } from "@/lib/types";

interface TechStackProps {
  technologies: TechnologyDoc[];
}

export default function TechStack({ technologies }: TechStackProps) {
  // Sort them by order: 1, 2, 3
  const sorted = [...technologies].sort((a, b) => a.order - b.order);

  return (
    <section className="py-[var(--spacing-section)] relative">
      <div id="canvas-particle-stage" className="absolute inset-0 pointer-events-none z-0" aria-hidden="true" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-6)] relative z-10">
        {sorted.map((techGroup) => (
          <div key={techGroup.category}>
            <h3 className="text-[length:var(--text-label)] font-mono text-[var(--color-text-muted)] uppercase mb-[var(--spacing-4)]">
              {techGroup.category}
            </h3>
            <ul className="space-y-[var(--spacing-2)]">
              {techGroup.items.map((item) => (
                <li key={item} className="text-[length:var(--text-body-l)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Update `src/app/page.tsx`

Fetch `getTechnologies()` and pass to `TechStack`.

```tsx
import { getTechnologies } from "@/lib/firestore";
// ...

export default async function Home() {
  const technologies = await getTechnologies();
  // ...

  return (
    <main>
      {/* ... */}
      <TechStack technologies={technologies} />
      {/* ... */}
    </main>
  );
}
```

---

## Verification
Run `npm run build`, `npm run lint`, `npx tsc --noEmit`. Ensure they pass.
