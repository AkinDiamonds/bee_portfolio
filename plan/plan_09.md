# plan_09 — Experience Form + Work Experience Frontend Wiring

**Goal:** Build the Experience admin form to manage past work experience entries. Wire up the `WorkExperience` frontend component to pull from Firestore instead of hardcoded data.

**Prerequisite:** plan_08 complete.

---

## Part A — Admin: ExperienceForm

### Create `src/app/admin/forms/ExperienceForm.tsx`

This form manages `ExperienceDoc` entries.
From `convention.md`, the model is:
```ts
{
  role: string;
  company: string;
  startDate: string;         // "Jan 2023" or "2023"
  endDate?: string;          // "Present" or "Dec 2024" or omitted
}
```

```tsx
// src/app/admin/forms/ExperienceForm.tsx
"use client";

import { useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { ExperienceDoc } from "@/lib/types";

interface ExperienceFormProps {
  initial: ExperienceDoc[];
}

export default function ExperienceForm({ initial }: ExperienceFormProps) {
  const { authHeader } = useAdminAuth();
  const [experiences, setExperiences] = useState<ExperienceDoc[]>(initial);
  
  // Implementation details:
  // - Render a list of experiences with "Edit" or "Delete" buttons
  // - Provide a form to add a new experience entry (role, company, startDate, endDate)
  // - On "Save", POST the updated payload to `/api/admin/experience`
  // - On "Delete", DELETE to `/api/admin/experience` (if using ID based)
  
  return (
    <section className="mt-[var(--spacing-8)]">
      <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] mb-[var(--spacing-4)]">
        Work Experience
      </h2>
      <div className="flex flex-col gap-[var(--spacing-4)]">
        {experiences.map((exp, idx) => (
          <div key={idx} className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)] flex justify-between">
            <div>
              <p className="font-[number:var(--font-weight-medium)]">{exp.role}</p>
              <p className="text-[length:var(--text-body-s)] text-[var(--color-text-secondary)]">{exp.company}</p>
              <p className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">{exp.startDate} - {exp.endDate || "Present"}</p>
            </div>
            {/* Delete/Edit actions */}
          </div>
        ))}
      </div>
      
      {/* Form to add a new experience */}
    </section>
  );
}
```

### Update `src/app/admin/tabs/SiteDataTab.tsx`

Add `ExperienceForm` to `SiteDataTab` and fetch the data on mount via `/api/admin/experience-read`.

---

## Part B — Frontend Wiring

### Update `src/components/experience/WorkExperience.tsx`

Modify it to accept an `experience` prop.

```tsx
// src/components/experience/WorkExperience.tsx
import type { ExperienceDoc } from "@/lib/types";
import { formatExperiencePeriod } from "@/lib/firestore";

interface WorkExperienceProps {
  experience: ExperienceDoc[];
}

export default function WorkExperience({ experience }: WorkExperienceProps) {
  return (
    <section className="py-[var(--spacing-section)]">
      <div className="flex flex-col gap-0">
        {experience.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-4)] py-[var(--spacing-4)] border-b border-[var(--color-border-default)] last:border-b-0">
            <div className="text-[length:var(--text-body-m)] font-[number:var(--font-weight-bold)]">
              {item.role}
            </div>
            <div className="text-[length:var(--text-body-m)] text-[var(--color-text-secondary)]">
              {item.company}
            </div>
            <div className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)] md:text-right">
              {formatExperiencePeriod(item)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Update `src/app/page.tsx`

Fetch `getExperience()` and pass it to `WorkExperience`.

```tsx
import { getExperience } from "@/lib/firestore";
// ...

export default async function Home() {
  const experience = await getExperience();
  // ...

  return (
    <main>
      {/* ... */}
      <WorkExperience experience={experience} />
      {/* ... */}
    </main>
  );
}
```

---

## Verification
Run `npm run build`, `npm run lint`, `npx tsc --noEmit`. Ensure they pass.
