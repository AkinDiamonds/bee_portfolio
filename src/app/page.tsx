import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import WorkExperience from "@/components/experience/WorkExperience";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)]">
        <Hero />
        <FeaturedProjects />
        <WorkExperience />
      </main>
    </div>
  );
}
