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

  const inputClass =
    "w-full border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-[var(--spacing-7)]">
      {/* ── Hero Text ── */}
      <section className="flex flex-col gap-[var(--spacing-4)]">
        <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          Hero Text
        </h2>
        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="heroName"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Name (small label above headline)
          </label>
          <input
            id="heroName"
            value={form.heroName}
            onChange={(e) => set("heroName", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="heroTagline"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Headline (h1 tagline)
          </label>
          <input
            id="heroTagline"
            value={form.heroTagline}
            onChange={(e) => set("heroTagline", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="heroSubtitle"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Subtitle (paragraph below headline)
          </label>
          <input
            id="heroSubtitle"
            value={form.heroSubtitle}
            onChange={(e) => set("heroSubtitle", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="footerQuote"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Footer quote (bee humor line)
          </label>
          <input
            id="footerQuote"
            value={form.footerQuote}
            onChange={(e) => set("footerQuote", e.target.value)}
            className={inputClass}
          />
        </div>
      </section>

      {/* ── Contact Links ── */}
      <section className="flex flex-col gap-[var(--spacing-4)]">
        <h2 className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
          Contact Links
        </h2>
        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="githubUrl"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            GitHub URL
          </label>
          <input
            id="githubUrl"
            type="url"
            value={form.githubUrl}
            onChange={(e) => set("githubUrl", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="linkedinUrl"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            LinkedIn URL
          </label>
          <input
            id="linkedinUrl"
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => set("linkedinUrl", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="whatsappUrl"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            WhatsApp URL (full wa.me link)
          </label>
          <input
            id="whatsappUrl"
            type="url"
            value={form.whatsappUrl}
            onChange={(e) => set("whatsappUrl", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="email"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="calUrl"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Cal.com scheduling URL
          </label>
          <input
            id="calUrl"
            type="url"
            value={form.calUrl}
            onChange={(e) => set("calUrl", e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-[var(--spacing-2)]">
          <label
            htmlFor="phone"
            className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
          >
            Phone (copy-to-clipboard value)
          </label>
          <input
            id="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => set("phone", e.target.value)}
            className={inputClass}
          />
        </div>
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
