"use client";

import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { getFirebaseDb, isFirebaseConfigured } from "@/lib/firebase";

const collections = ["site", "projects", "posts", "experience", "technologies", "testimonials"] as const;

export default function AdminDashboard() {
  const [collectionName, setCollectionName] = useState<(typeof collections)[number]>("projects");
  const [documentId, setDocumentId] = useState("");
  const [content, setContent] = useState("{\n  \"title\": \"\",\n  \"videoUrl\": \"\"\n}");
  const [status, setStatus] = useState("");

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!documentId.trim()) return setStatus("Enter a document ID or slug.");
    try {
      const data = JSON.parse(content) as Record<string, unknown>;
      await setDoc(doc(getFirebaseDb(), collectionName, documentId.trim()), { ...data, updatedAt: new Date().toISOString() }, { merge: true });
      setStatus("Saved.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save this document.");
    }
  };

  if (!isFirebaseConfigured) return <p>Firebase environment variables are missing.</p>;
  return <form onSubmit={save}><h1>Portfolio admin</h1><p>Save any public portfolio document as JSON. Project video URLs belong in <code>videoUrl</code>.</p><label>Collection<select value={collectionName} onChange={(event) => setCollectionName(event.target.value as typeof collectionName)}>{collections.map((name) => <option key={name}>{name}</option>)}</select></label><label>Document ID / slug<input value={documentId} onChange={(event) => setDocumentId(event.target.value)} /></label><label>Content JSON<textarea value={content} onChange={(event) => setContent(event.target.value)} rows={18} /></label><button type="submit">Save changes</button><p role="status">{status}</p></form>;
}
