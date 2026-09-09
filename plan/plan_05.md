# plan_05 — Admin UI Shell (Tabbed Layout + Auth Context)

**Goal:** Replace the raw-JSON `AdminDashboard.tsx` with a polished, mobile-friendly tabbed shell. Add an `AdminAuthContext` so child forms can read credentials without prop-drilling. Build the tab containers as empty stubs (the actual form content goes in plans 06–11).

**Prerequisite:** plan_03 complete.

---

## Files to create / modify

| Action | File |
|---|---|
| REPLACE | `src/app/admin/AdminDashboard.tsx` |
| CREATE | `src/app/admin/AdminAuthContext.tsx` |
| CREATE | `src/app/admin/tabs/SiteDataTab.tsx` (stub) |
| CREATE | `src/app/admin/tabs/BlogTab.tsx` (stub) |

---

## Step 1 — Create `src/app/admin/AdminAuthContext.tsx`

This context stores the Basic Auth credentials entered at login. Every form reads from it to attach the Authorization header to API calls.

```tsx
// src/app/admin/AdminAuthContext.tsx
"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface AdminAuthCtx {
  username: string;
  password: string;
  authHeader: string; // precomputed "Basic xxx" value
}

const AdminAuthContext = createContext<AdminAuthCtx>({
  username: "",
  password: "",
  authHeader: "",
});

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

interface AdminAuthProviderProps {
  username: string;
  password: string;
  children: ReactNode;
}

export function AdminAuthProvider({ username, password, children }: AdminAuthProviderProps) {
  const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
  return (
    <AdminAuthContext.Provider value={{ username, password, authHeader }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
```

---

## Step 2 — Create stub `src/app/admin/tabs/SiteDataTab.tsx`

```tsx
// src/app/admin/tabs/SiteDataTab.tsx
"use client";

export default function SiteDataTab() {
  return (
    <div className="py-[var(--spacing-6)]">
      <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
        Site data forms load here. (plans 06–10)
      </p>
    </div>
  );
}
```

---

## Step 3 — Create stub `src/app/admin/tabs/BlogTab.tsx`

```tsx
// src/app/admin/tabs/BlogTab.tsx
"use client";

export default function BlogTab() {
  return (
    <div className="py-[var(--spacing-6)]">
      <p className="text-[length:var(--text-body-s)] text-[var(--color-text-muted)]">
        Blog editor loads here. (plan 11)
      </p>
    </div>
  );
}
```

---

## Step 4 — Replace `src/app/admin/AdminDashboard.tsx`

Delete all existing content and replace with the tabbed shell below.

The component:
1. Shows a login form if credentials are not yet entered.
2. Verifies credentials by calling `GET /api/admin/site` and checking the response (401 = wrong password, 200 = correct).
3. On success, wraps the tabs in `AdminAuthProvider` and shows two tabs.

```tsx
// src/app/admin/AdminDashboard.tsx
"use client";

import { useState } from "react";
import { AdminAuthProvider } from "./AdminAuthContext";
import SiteDataTab from "./tabs/SiteDataTab";
import BlogTab from "./tabs/BlogTab";

type TabId = "site" | "blog";

const tabs: { id: TabId; label: string }[] = [
  { id: "site", label: "Site Data" },
  { id: "blog", label: "Blog" },
];

export default function AdminDashboard() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [checking, setChecking] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("site");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/site", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`,
        },
        body: JSON.stringify({}),
      });
      if (res.status === 401) {
        setLoginError("Incorrect username or password.");
      } else {
        setAuthed(true);
      }
    } catch {
      setLoginError("Network error. Check your connection.");
    } finally {
      setChecking(false);
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background-default)] px-[var(--spacing-5)]">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm flex flex-col gap-[var(--spacing-4)]"
        >
          <h1 className="text-[length:var(--text-heading-h3)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Admin
          </h1>

          <div className="flex flex-col gap-[var(--spacing-2)]">
            <label
              htmlFor="admin-username"
              className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
            >
              Username
            </label>
            <input
              id="admin-username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </div>

          <div className="flex flex-col gap-[var(--spacing-2)]">
            <label
              htmlFor="admin-password"
              className="text-[length:var(--text-label)] font-[number:var(--font-weight-medium)] text-[var(--color-text-secondary)]"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="border border-[var(--color-border-default)] rounded-[var(--radius-sm)] px-[var(--spacing-4)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] text-[var(--color-text-primary)] bg-[var(--color-background-default)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent-primary)]"
            />
          </div>

          {loginError && (
            <p
              role="alert"
              className="text-[length:var(--text-label)] text-red-600"
            >
              {loginError}
            </p>
          )}

          <button
            type="submit"
            disabled={checking}
            className="bg-[var(--color-action-primary)] text-[var(--color-neutral-0)] rounded-[var(--radius-sm)] px-[var(--spacing-6)] py-[var(--spacing-3)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {checking ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminAuthProvider username={username} password={password}>
      <div className="min-h-screen bg-[var(--color-background-default)]">
        {/* Header */}
        <div className="border-b border-[var(--color-border-default)] px-[var(--spacing-5)] md:px-[var(--spacing-8)] py-[var(--spacing-4)]">
          <p className="text-[length:var(--text-heading-h4)] font-[number:var(--font-weight-semibold)] text-[var(--color-text-primary)]">
            Portfolio Admin
          </p>
        </div>

        {/* Tab bar */}
        <div
          role="tablist"
          aria-label="Admin sections"
          className="flex border-b border-[var(--color-border-default)] px-[var(--spacing-5)] md:px-[var(--spacing-8)]"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`tabpanel-${tab.id}`}
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-[var(--spacing-5)] py-[var(--spacing-4)] text-[length:var(--text-body-s)] font-[number:var(--font-weight-medium)] border-b-2 transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "border-[var(--color-accent-primary)] text-[var(--color-text-primary)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="max-w-3xl mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)]">
          <div
            role="tabpanel"
            id="tabpanel-site"
            aria-labelledby="tab-site"
            hidden={activeTab !== "site"}
          >
            <SiteDataTab />
          </div>
          <div
            role="tabpanel"
            id="tabpanel-blog"
            aria-labelledby="tab-blog"
            hidden={activeTab !== "blog"}
          >
            <BlogTab />
          </div>
        </div>
      </div>
    </AdminAuthProvider>
  );
}
```

---

## Verification

Navigate to `http://localhost:3000/admin` in your browser.

Expected behavior:
1. Login form appears with Username and Password fields.
2. Enter the credentials from `.env.local` (`Simeon` / `Simeon` by default) — click Sign in.
3. After a moment, the tabbed admin layout appears with "Site Data" and "Blog" tabs.
4. Clicking each tab switches the panel.
5. Entering wrong credentials shows the error message.

Then run:

```bash
npm run build
npm run lint
npx tsc --noEmit
```

---

## Done checklist

- [ ] `AdminAuthContext.tsx` created with `useAdminAuth` hook and `AdminAuthProvider`
- [ ] `tabs/SiteDataTab.tsx` created (stub)
- [ ] `tabs/BlogTab.tsx` created (stub)
- [ ] `AdminDashboard.tsx` replaced with tabbed shell + login form
- [ ] Login form works: correct credentials → tabs shown, wrong credentials → error shown
- [ ] Tab switching works
- [ ] `npm run build` passes
- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
