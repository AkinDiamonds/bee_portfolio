# plan_06 — Profile Form + Hero / Navbar / Footer Frontend Wiring

**Goal:** Build the Profile admin form so you can save all `site/profile` fields (hero text, contact links, footer quote, resume upload). Then wire the frontend Hero, Navbar, and Footer to display data from the `profile` prop instead of hardcoded values.

**Prerequisite:** plan_03, plan_04, plan_05 complete.

---

## Part A — Admin: ProfileForm

### Create `src/app/admin/forms/ProfileForm.tsx`

This form has three logical sections: Hero Text, Contact Links, and Resume Upload. Keep each section visually grouped with a heading. The form uses `useAdminAuth()` for credentials.

```tsx
// src/app/admin/forms/ProfileForm.tsx
"use client";

import { useState, useRef } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import type { SiteProfile } from "@/lib/types";

interface ProfileFormProps {
  initial: SiteProfile | null;
}

const defaultProfile: SiteProfile = {
  heroName: "",
  heroTagline: "",
  heroSubtitle: "",
  footerQuote: "",
  githubUrl: "",
  linkedinUrl: "",
  whatsappUrl: "",
  email: "",
  calUrl: "",
  phone: "",
  resumeUrl: "",
};

export default function ProfileForm({ initial }: ProfileFormProps) {
  const { authHeader } = useAdminAuth();
  const [form, setForm] = useState<SiteProfile>(initial ?? defaultProfile);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof SiteProfile, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving…");
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: authHeader },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "Saved!" : `Error: ${res.statusText}`);
    } catch {
      setStatus("Network error.");
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setStatus("Uploading resume…");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/resume", {
        method: "POST",
        headers: { Authorization: authHeader },
        body: fd,
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (data.url) {
        set("resumeUrl", data.url);
        setStatus("Resume uploaded. Click Save to confirm.");
      } else {
        setStatus(`Upload failed: ${data.error ?? "unknown error"}`);
      }
    } catch {
      setStatus("Upload failed: network error.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-7)]">

      {/* ── Hero Text ── */}
      <section className="flex flex-col gap-[var(--spacing-4)]">
        <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          Hero Text
        </h2>
        <Field label="Name (small label above headline)" id="heroName">
          <input id="heroName" value={form.heroName} onChange={(e) => set("heroName", e.target.value)} />
        </Field>
        <Field label="Headline (h1 tagline)" id="heroTagline">
          <input id="heroTagline" value={form.heroTagline} onChange={(e) => set("heroTagline", e.target.value)} />
        </Field>
        <Field label="Subtitle (paragraph below headline)" id="heroSubtitle">
          <input id="heroSubtitle" value={form.heroSubtitle} onChange={(e) => set("heroSubtitle", e.target.value)} />
        </Field>
        <Field label="Footer quote (bee humor line)" id="footerQuote">
          <input id="footerQuote" value={form.footerQuote} onChange={(e) => set("footerQuote", e.target.value)} />
        </Field>
      </section>

      {/* ── Contact Links ── */}
      <section className="flex flex-col gap-[var(--spacing-4)]">
        <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          Contact Links
        </h2>
        <Field label="GitHub URL" id="githubUrl">
          <input id="githubUrl" type="url" value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="LinkedIn URL" id="linkedinUrl">
          <input id="linkedinUrl" type="url" value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
        </Field>
        <Field label="WhatsApp URL (full wa.me link)" id="whatsappUrl">
          <input id="whatsappUrl" type="url" value={form.whatsappUrl} onChange={(e) => set("whatsappUrl", e.target.value)} />
        </Field>
        <Field label="Email address" id="email">
          <input id="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Cal.com scheduling URL" id="calUrl">
          <input id="calUrl" type="url" value={form.calUrl} onChange={(e) => set("calUrl", e.target.value)} />
        </Field>
        <Field label="Phone (copy-to-clipboard value)" id="phone">
          <input id="phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
      </section>

      {/* ── Resume ── */}
      <section className="flex flex-col gap-[var(--spacing-4)]">
        <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          Resume PDF
        </h2>
        {form.resumeUrl && (
          <p className="text-[length:var(--text-caption)] text-[var(--color-text-muted)] break-all">
            Current: {form.resumeUrl}
          </p>
        )}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-fit border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-5)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-secondary)] hover:bg-[var(--color-background-subtle)] disabled:opacity-50 cursor-pointer"
        >
          {uploading ? "Uploading…" : "Upload new PDF"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={handleResumeUpload}
        />
      </section>

      {/* ── Save ── */}
      <div className="flex items-center gap-[var(--spacing-4)]">
        <button
          type="submit"
          className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Save profile
        </button>
        {status && (
          <p role="status" className="text-[length:var(--text-label)] text-[var(--color-text-muted)]">
            {status}
          </p>
        )}
      </div>
    </form>
  );
}

// ── Shared field wrapper ──────────────────────────────────────────────────────

interface FieldProps {
  label: string;
  id: string;
  children: React.ReactElement;
}

function Field({ label, id, children }: FieldProps) {
  const inputClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  const child = children as React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;

  return (
    <div className="flex flex-col gap-[var(--spacing-2)]">
      <label
        htmlFor={id}
        className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
      >
        {label}
      </label>
      {/* Clone child to inject className without losing existing props */}
      {Object.assign({}, child, {
        props: { ...child.props, className: inputClass },
      } as React.ReactElement)}
    </div>
  );
}
```

> If the `Field` component clone approach causes TypeScript issues, replace `Field` usage with
> inline `<label>` + `<input className={inputClass}>` pairs. The `Field` helper is optional.

### Update `src/app/admin/tabs/SiteDataTab.tsx`

Replace the stub. This tab must load the current profile from Firestore to pre-populate the form.
`SiteDataTab` is a **client component** (it uses state), but it can fetch via a Server Action or
a `useEffect` call. Use `useEffect` + fetch for simplicity.

```tsx
// src/app/admin/tabs/SiteDataTab.tsx
"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import ProfileForm from "../forms/ProfileForm";
import type { SiteProfile } from "@/lib/types";

export default function SiteDataTab() {
  const { authHeader } = useAdminAuth();
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Fetch current profile via a public GET — profile is public data
    fetch("/api/admin/profile-read", { headers: { Authorization: authHeader } })
      .then((r) => r.json())
      .then((data: SiteProfile) => setProfile(data))
      .catch(() => setProfile(null))
      .finally(() => setLoaded(true));
  }, [authHeader]);

  if (!loaded) {
    return (
      <p className="py-[var(--spacing-6)] text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
        Loading…
      </p>
    );
  }

  return (
    <div className="py-[var(--spacing-6)] flex flex-col gap-[var(--spacing-9)]">
      <ProfileForm initial={profile} />
      {/* TechForm, ExperienceForm, TestimonialsForm, ProjectsForm added in plans 07–10 */}
    </div>
  );
}
```

### Create `src/app/api/admin/profile-read/route.ts`

A simple GET endpoint that returns the current profile (needed by SiteDataTab to pre-populate forms).

```ts
// src/app/api/admin/profile-read/route.ts
import { NextResponse } from 'next/server';
import { getAdminDb } from '@/lib/firebase-admin';
import { checkBasicAuth } from '../auth';

export async function GET(request: Request) {
  if (!checkBasicAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getAdminDb();
  const snap = await db.collection('site').doc('profile').get();
  if (!snap.exists) return NextResponse.json(null);
  return NextResponse.json(snap.data());
}
```

---

## Part B — Frontend: Hero wiring

Update `src/components/hero/Hero.tsx` to use the `profile` prop. All values fall back to static strings if `profile` is null (so the page never breaks if Firestore is empty).

```tsx
// src/components/hero/Hero.tsx
import Link from "next/link";
import type { SiteProfile } from "@/lib/types";

interface HeroProps {
  profile: SiteProfile | null;
}

export default function Hero({ profile }: HeroProps) {
  const name = profile?.heroName || "TODO: heroName";
  const tagline = profile?.heroTagline || "TODO: heroTagline";
  const subtitle = profile?.heroSubtitle || "TODO: heroSubtitle";

  return (
    <section
      id="hero"
      aria-label="Hero Introduction"
      className="relative min-h-[calc(100svh-var(--spacing-8))] flex flex-col justify-center items-center text-center px-[var(--spacing-5)] py-[var(--spacing-8)] overflow-hidden"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center z-10">
        <span className="mb-[var(--spacing-5)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-secondary)] tracking-widest">
          {name}
        </span>

        <h1 className="text-[length:var(--text-heading-h2)] md:text-[length:var(--text-display-l)] leading-[1.05] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)] tracking-[var(--tracking-tight-display)] text-balance">
          {tagline}
        </h1>

        <p className="mt-[var(--spacing-6)] text-[length:var(--text-body-l)] font-[number:var(--font-weight-regular)] text-[var(--color-text-secondary)] max-w-xl text-balance">
          {subtitle}
        </p>

        <div className="mt-[var(--spacing-8)] flex items-center justify-center gap-[var(--spacing-4)] flex-wrap">
          <a
            href="#projects"
            className="inline-flex items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-3)] bg-[var(--color-text-primary)] text-[var(--color-neutral-0)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] rounded-full transition-transform active:scale-95 hover:opacity-90 shadow-sm cursor-pointer"
          >
            Explore Projects
          </a>
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-[var(--spacing-6)] py-[var(--spacing-3)] bg-[var(--color-neutral-100)] text-[var(--color-text-primary)] font-[number:var(--font-weight-medium)] text-[length:var(--text-body-s)] rounded-full transition-colors hover:bg-[var(--color-neutral-200)] active:scale-95"
          >
            Read Articles
          </Link>
        </div>
      </div>

      <div
        id="bee-perch-target"
        aria-hidden="true"
        className="pointer-events-none absolute top-12 right-6 md:right-16 w-32 h-32 md:w-48 md:h-48"
      />
    </section>
  );
}
```

---

## Part C — Frontend: Navbar wiring

Update `src/components/nav/Navbar.tsx` to build the contact links array from the `profile` prop. Remove the hardcoded `contactLinks` constant. Keep all existing hover/mobile logic intact.

Find the hardcoded `contactLinks` array (lines 16–24) and replace it with a function that derives contact links from the profile:

```tsx
// Add this import at the top
import type { SiteProfile } from "@/lib/types";

// Replace the hardcoded contactLinks constant with this function:
function buildContactLinks(profile: SiteProfile | null): ContactLink[] {
  return [
    { label: "GitHub", href: profile?.githubUrl || "#", external: true },
    { label: "LinkedIn", href: profile?.linkedinUrl || "#", external: true },
    { label: "WhatsApp", href: profile?.whatsappUrl || "#", external: true },
    { label: "Email", href: `mailto:${profile?.email || ""}` },
    { label: "Schedule a meeting", href: profile?.calUrl || "#", external: true },
    { label: "Phone", isCopy: true, copyValue: profile?.phone || "" },
    { label: "Download Résumé", href: profile?.resumeUrl || "/resume.pdf", isDownload: true },
  ];
}

// Update the function signature:
interface NavbarProps { profile: SiteProfile | null }
export default function Navbar({ profile }: NavbarProps) {
  const contactLinks = buildContactLinks(profile);
  // ... rest of component unchanged
```

Also update the brand name in the JSX. Find the hardcoded `Simeon <span>Akinrinola</span>` and replace with:

```tsx
{profile?.heroName?.split(' ')[0] ?? 'Simeon'}{' '}
<span className="font-normal opacity-80">
  {profile?.heroName?.split(' ').slice(1).join(' ') ?? 'Akinrinola'}
</span>
```

---

## Part D — Frontend: Footer wiring

Update `src/components/footer/Footer.tsx` to use `profile.footerQuote` and dynamic social links.

```tsx
import { Mail } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { SiGithub } from "react-icons/si";
import styles from "./Footer.module.css";
import type { SiteProfile } from "@/lib/types";

interface FooterProps {
  profile: SiteProfile | null;
}

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const quote = profile?.footerQuote || "This site is haunted by a bee. It\u2019s not a bug, it\u2019s the most important feature.";
  const github = profile?.githubUrl || "#";
  const linkedin = profile?.linkedinUrl || "#";
  const email = profile?.email ? `mailto:${profile.email}` : "#";
  const name = profile?.heroName || "Simeon Akinrinola";

  return (
    <footer className={styles.footer}>
      <div className={styles.metaRow}>
        <p className={styles.quote}>{quote}</p>
        <nav className={styles.socialLinks} aria-label="Social links">
          <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile" className={styles.socialLink}>
            <FaLinkedin aria-hidden="true" />
          </a>
          <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile" className={styles.socialLink}>
            <SiGithub aria-hidden="true" />
          </a>
          <a href={email} aria-label={`Email ${name}`} className={styles.socialLink}>
            <Mail aria-hidden="true" />
          </a>
        </nav>
      </div>

      <div id="bee-playground" className={styles.wordmarkStage}>
        <span className={styles.srOnly}>{name.split(' ')[0]}.</span>
        <span className={styles.wordmark} aria-hidden="true">
          <span>SIME</span>
          <span id="bee-landing-pad" data-bee-landing-zone="center" className={styles.landingPad}>O</span>
          <span>N</span>
          <span className={styles.period} data-bee-accent="true">.</span>
        </span>
      </div>

      <div className={styles.bottomRow}>
        <p>© {currentYear} {name}. All rights reserved.</p>
      </div>
    </footer>
  );
}
```

---

## Verification

1. Start dev server: `npm run dev`
2. Visit `http://localhost:3000/admin` — log in — fill in Profile form — click Save
3. Visit `http://localhost:3000` — verify Hero shows the saved name/tagline/subtitle
4. Open the Contact dropdown in the navbar — verify links use the saved URLs
5. Check the footer quote

Then:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

---

## Done checklist

- [ ] `ProfileForm.tsx` created
- [ ] `SiteDataTab.tsx` updated (no longer a stub)
- [ ] `profile-read/route.ts` created
- [ ] `Hero.tsx` uses profile prop, no hardcoded text
- [ ] `Navbar.tsx` uses profile prop for contact links and brand name
- [ ] `Footer.tsx` uses profile prop for quote and social links
- [ ] Saving from admin and refreshing homepage shows updated text
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
