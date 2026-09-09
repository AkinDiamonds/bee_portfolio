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
