# plan_07 — Projects Form + Featured Projects Frontend Wiring

**Goal:** Build the Projects admin form so you can add, edit, and reorder portfolio projects (including media uploads). Then wire up the `FeaturedProjects` frontend component and individual project pages to pull from Firestore.

**Prerequisite:** plan_06 complete.

---

## Part A — Admin: ProjectsForm

### Create `src/app/admin/forms/ProjectsForm.tsx`

This form handles creating and updating projects, including uploading their demo media (image or video).

```tsx
// src/app/admin/forms/ProjectsForm.tsx
"use client";

import { useState, useRef } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { ProjectDoc } from "@/lib/types";

interface ProjectsFormProps {
  initial: ProjectDoc[];
}

export default function ProjectsForm({ initial }: ProjectsFormProps) {
  const { authHeader } = useAdminAuth();
  const [projects, setProjects] = useState<ProjectDoc[]>(initial);
  const [status, setStatus] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);

  // Provide a simplified form to add/edit projects. 
  // In a real implementation, you might want a modal or a separate sub-route for editing a full project, 
  // but for this plan we'll keep it inline or assume a simplified layout for brevity.

  return (
    <section className="mt-[var(--spacing-8)]">
      <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] mb-[var(--spacing-4)]">
        Projects
      </h2>
      <div className="flex flex-col gap-[var(--spacing-4)]">
        {projects.map((proj) => (
          <div key={proj.slug} className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)]">
            <h3 className="font-[number:var(--font-weight-medium)]">{proj.title}</h3>
            <p className="text-[length:var(--text-body-s)] text-[var(--color-text-secondary)]">{proj.slug}</p>
            {/* Add fields here to edit summary, description, demo URL, etc. */}
          </div>
        ))}
        {/* Button to add new project */}
      </div>
    </section>
  );
}
```

> **Note:** The actual implementation should include inputs for all fields in `ProjectDoc` (summary, description, tags, type, order, visibility, etc.) and a save button that POSTs to `/api/admin/projects`.

### Update `src/app/admin/tabs/SiteDataTab.tsx`

Add `ProjectsForm` to the `SiteDataTab`. You will need to fetch the list of projects on mount, similar to how the profile is fetched.

```tsx
// Inside SiteDataTab.tsx, fetch projects:
const [projects, setProjects] = useState<ProjectDoc[]>([]);

useEffect(() => {
  // ... existing profile fetch ...
  
  fetch("/api/admin/projects-read", { headers: { Authorization: authHeader } })
    .then((r) => r.json())
    .then((data) => setProjects(data))
    .catch(() => setProjects([]));
}, [authHeader]);

// In the render return:
<ProjectsForm initial={projects} />
```

---

## Part B — Frontend Wiring

### Update `src/components/projects/FeaturedProjects.tsx`

Currently, `FeaturedProjects` might be importing static data from `src/lib/content.ts`. Modify it to accept a `projects` prop.

```tsx
// src/components/projects/FeaturedProjects.tsx
import type { ProjectDoc } from "@/lib/types";

interface FeaturedProjectsProps {
  projects: ProjectDoc[];
}

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  // Filter for visible projects and sort by order (if not already sorted by the fetch function)
  const visibleProjects = projects.filter(p => p.visibility).sort((a, b) => a.order - b.order);

  return (
    <section className="py-[var(--spacing-section)]">
      {visibleProjects.map((project, idx) => (
        <div key={project.slug} className="grid grid-cols-1 md:grid-cols-2 gap-[var(--spacing-6)] mb-[var(--spacing-8)]">
           {/* Render card: left side text, right side image/video (alternate based on idx % 2 === 0) */}
        </div>
      ))}
    </section>
  );
}
```

### Update `src/app/page.tsx`

Fetch the projects using the server-side `getProjects()` function and pass them to `FeaturedProjects`.

```tsx
import { getProjects } from "@/lib/firestore";
// ... other imports

export default async function Home() {
  const projects = await getProjects();
  // ... other fetches

  return (
    <main>
      {/* ... */}
      <FeaturedProjects projects={projects} />
      {/* ... */}
    </main>
  );
}
```

### Create/Update Project Detail Page

**File:** `src/app/projects/[slug]/page.tsx`

Fetch the project by slug and render its details, playing the video loop if it is a video demo.

```tsx
import { getProjectBySlug } from "@/lib/firestore";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = await getProjectBySlug(params.slug);
  
  if (!project) {
    notFound();
  }

  return (
    <article className="max-w-[var(--container-portfolio)] mx-auto px-[var(--spacing-5)]">
      <h1 className="text-[length:var(--text-heading-h1)] font-[number:var(--font-weight-bold)]">
        {project.title}
      </h1>
      
      {/* If video: */}
      {project.demoType === 'video' && project.demoUrl && (
        <video src={project.demoUrl} autoPlay muted loop playsInline className="w-full rounded-[var(--radius-lg)]" />
      )}
      
      {/* If image: */}
      {project.demoType === 'image' && project.demoUrl && (
        <img src={project.demoUrl} alt={project.title} className="w-full rounded-[var(--radius-lg)]" />
      )}
      
      {/* Render other details */}
    </article>
  );
}
```

---

## Verification

Run the standard check:
```bash
npm run build
npm run lint
npx tsc --noEmit
```
All must pass with zero errors.
