import Navbar from "@/components/nav/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)]">
        {/* Sections will be mounted here in order */}
      </main>
    </div>
  );
}
