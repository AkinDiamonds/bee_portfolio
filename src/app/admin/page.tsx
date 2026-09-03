import type { Metadata } from "next";
import AdminDashboard from "./AdminDashboard";

export const metadata: Metadata = { title: "Portfolio admin", robots: { index: false, follow: false } };

export default function AdminPage() {
  return <main><AdminDashboard /></main>;
}
