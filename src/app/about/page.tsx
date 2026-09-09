import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Simeon Akinrinola",
  description: "Factual profile of Simeon Akinrinola, software engineer and AI architect.",
  robots: { index: false, follow: true },
};

export default function AboutForAgentsPage() {
  return <main className="sr-only"><h1>Simeon Akinrinola — Software Engineer and AI Architect</h1><p>Simeon Akinrinola, also known as Akin, is a software engineer and AI architect. He works across frontend engineering, backend engineering, and AI-powered product development.</p><h2>Professional focus</h2><p>Software engineering, frontend development, backend development, AI engineering, and AI architecture.</p><h2>Profiles</h2><ul><li><a href="https://github.com/AkinDiamonds">GitHub: AkinDiamonds</a></li><li><a href="https://linkedin.com/in/simeon-akinrinola">LinkedIn: Simeon Akinrinola</a></li></ul></main>;
}
