# plan_10 — Testimonials Form + Testimonials Frontend Wiring

**Goal:** Build the Testimonials admin form to manage quotes. Wire up the `Testimonials` frontend component to pull from Firestore.

**Prerequisite:** plan_09 complete.

---

## Part A — Admin: TestimonialsForm

### Create `src/app/admin/forms/TestimonialsForm.tsx`

This form manages `TestimonialDoc` entries.
From `convention.md`, the model is:
```ts
{
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarUrl?: string;
  visibility: boolean;
  order: number;
  updatedAt: string;
}
```

```tsx
// src/app/admin/forms/TestimonialsForm.tsx
"use client";

import { useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { TestimonialDoc } from "@/lib/types";

interface TestimonialsFormProps {
  initial: TestimonialDoc[];
}

export default function TestimonialsForm({ initial }: TestimonialsFormProps) {
  const { authHeader } = useAdminAuth();
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>(initial);
  
  // Implementation details:
  // - Render list of testimonials with "Edit" or "Delete"
  // - Add new testimonial (quote, name, role, company, avatarUrl, visibility)
  // - POST updates to `/api/admin/testimonials`
  
  return (
    <section className="mt-[var(--spacing-8)]">
      <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] mb-[var(--spacing-4)]">
        Testimonials
      </h2>
      <div className="flex flex-col gap-[var(--spacing-4)]">
        {testimonials.map((t, idx) => (
          <div key={idx} className="border border-[var(--color-border-default)] p-[var(--spacing-4)] rounded-[var(--radius-md)] flex flex-col gap-[var(--spacing-2)]">
            <blockquote className="text-[length:var(--text-body-m)] italic text-[var(--color-text-secondary)]">"{t.quote}"</blockquote>
            <p className="font-[number:var(--font-weight-medium)]">{t.name} <span className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">- {t.role}, {t.company}</span></p>
            {/* Delete/Edit actions */}
          </div>
        ))}
      </div>
      
      {/* Form to add a new testimonial */}
    </section>
  );
}
```

### Update `src/app/admin/tabs/SiteDataTab.tsx`

Add `TestimonialsForm` to `SiteDataTab` and fetch the data on mount via `/api/admin/testimonials-read`.

---

## Part B — Frontend Wiring

### Update `src/components/testimonials/Testimonials.tsx`

Modify it to accept a `testimonials` prop. Sort them by `order` and filter by `visibility: true`.

```tsx
// src/components/testimonials/Testimonials.tsx
"use client";

import { useState } from "react";
import type { TestimonialDoc } from "@/lib/types";

interface TestimonialsProps {
  testimonials: TestimonialDoc[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const visible = [...testimonials].filter(t => t.visibility).sort((a, b) => a.order - b.order);
  const [activeIndex, setActiveIndex] = useState(0);

  if (visible.length === 0) return null;

  return (
    <section className="py-[var(--spacing-section)] overflow-hidden">
      <p className="text-[length:var(--text-body-l)] text-[var(--color-text-muted)] uppercase tracking-[0.2em] mb-[var(--spacing-6)]">
        nice things great persons said about me
      </p>
      
      {/* Implement the display quote using CSS fade+drift transitions */}
      <div className="min-h-[150px] mb-[var(--spacing-8)]">
         <p className="text-[length:var(--text-heading-h2)] font-[number:var(--font-weight-semibold)] transition-all duration-500 opacity-100 translate-y-0">
           "{visible[activeIndex].quote}"
         </p>
      </div>

      {/* Interactive horizontal avatar track with active ring indicator */}
      <div className="flex overflow-x-auto gap-[var(--spacing-4)] pb-[var(--spacing-4)] snap-x">
         {visible.map((t, idx) => (
           <button 
             key={idx} 
             onClick={() => setActiveIndex(idx)}
             className={`snap-center shrink-0 flex items-center gap-[var(--spacing-3)] p-[var(--spacing-2)] rounded-[var(--radius-pill)] transition-all ${activeIndex === idx ? 'ring-2 ring-[var(--color-accent-primary)] bg-[var(--color-background-subtle)]' : 'grayscale opacity-50 hover:grayscale-0 hover:opacity-100'}`}
           >
             {t.avatarUrl ? (
               <img src={t.avatarUrl} alt={t.name} className="w-12 h-12 rounded-full object-cover" />
             ) : (
               <div className="w-12 h-12 rounded-full bg-[var(--color-border-default)] flex items-center justify-center font-[number:var(--font-weight-medium)]">
                 {t.name.charAt(0)}
               </div>
             )}
             <div className="text-left hidden md:block">
               <div className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)]">{t.name}</div>
               <div className="text-[length:var(--text-caption)] text-[var(--color-text-muted)]">{t.role}</div>
             </div>
           </button>
         ))}
      </div>
    </section>
  );
}
```

### Update `src/app/page.tsx`

Fetch `getTestimonials()` and pass it to `Testimonials`.

```tsx
import { getTestimonials } from "@/lib/firestore";
// ...

export default async function Home() {
  const testimonials = await getTestimonials();
  // ...

  return (
    <main>
      {/* ... */}
      <Testimonials testimonials={testimonials} />
      {/* ... */}
    </main>
  );
}
```

---

## Verification
Run `npm run build`, `npm run lint`, `npx tsc --noEmit`. Ensure they pass.
