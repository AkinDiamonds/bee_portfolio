import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import WorkExperience from "@/components/experience/WorkExperience";
import Testimonials from "@/components/testimonials/Testimonials";
import TechStack from "@/components/tech/TechStack";
import LatestBlogs from "@/components/blog/LatestBlogs";
import Footer from "@/components/footer/Footer";
import { getTestimonials, getTechStack, getBlogPosts } from "@/lib/content";

export default function Home() {
  const testimonials = getTestimonials();
  const techStack = getTechStack();
  const blogPosts = getBlogPosts();

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <Navbar />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)]">
        <Hero />
        <FeaturedProjects />
        <WorkExperience />
        <Testimonials testimonials={testimonials} />
        <TechStack techStack={techStack} />
        <LatestBlogs posts={blogPosts} />
        <Footer />
      </main>
    </div>
  );
}
