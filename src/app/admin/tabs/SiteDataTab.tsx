// src/app/admin/tabs/SiteDataTab.tsx
"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "../AdminAuthContext";
import ProfileForm from "../forms/ProfileForm";
import ProjectsForm from "../forms/ProjectsForm";
import TechForm from "../forms/TechForm";
import ExperienceForm from "../forms/ExperienceForm";
import TestimonialsForm from "../forms/TestimonialsForm";
import type { SiteProfile, ProjectDoc, TechCategoryDoc, ExperienceDoc, TestimonialDoc } from "@/lib/types";

export default function SiteDataTab() {
  const { authHeader } = useAdminAuth();
  const [profile, setProfile] = useState<SiteProfile | null>(null);
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [technologies, setTechnologies] = useState<TechCategoryDoc[]>([]);
  const [experiences, setExperiences] = useState<ExperienceDoc[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialDoc[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/profile-read", { headers: { Authorization: authHeader } })
        .then((r) => r.json())
        .then((data: SiteProfile) => setProfile(data))
        .catch(() => setProfile(null)),
      fetch("/api/admin/projects-read", { headers: { Authorization: authHeader } })
        .then((r) => r.json())
        .then((data: ProjectDoc[]) => setProjects(Array.isArray(data) ? data : []))
        .catch(() => setProjects([])),
      fetch("/api/admin/technologies-read", { headers: { Authorization: authHeader } })
        .then((r) => r.json())
        .then((data: TechCategoryDoc[]) => setTechnologies(Array.isArray(data) ? data : []))
        .catch(() => setTechnologies([])),
      fetch("/api/admin/experience-read", { headers: { Authorization: authHeader } })
        .then((r) => r.json())
        .then((data: ExperienceDoc[]) => setExperiences(Array.isArray(data) ? data : []))
        .catch(() => setExperiences([])),
      fetch("/api/admin/testimonials-read", { headers: { Authorization: authHeader } })
        .then((r) => r.json())
        .then((data: TestimonialDoc[]) => setTestimonials(Array.isArray(data) ? data : []))
        .catch(() => setTestimonials([])),
    ]).finally(() => setLoaded(true));
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
      <ProjectsForm initial={projects} />
      <TechForm initial={technologies} />
      <ExperienceForm initial={experiences} />
      <TestimonialsForm initial={testimonials} />
    </div>
  );
}
