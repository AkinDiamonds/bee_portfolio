import Navbar from "@/components/nav/Navbar";
import Hero from "@/components/hero/Hero";
import FeaturedProjects from "@/components/projects/FeaturedProjects";
import WorkExperience from "@/components/experience/WorkExperience";
import Testimonials from "@/components/testimonials/Testimonials";
import TechStack from "@/components/tech/TechStack";
import LatestBlogs from "@/components/blog/LatestBlogs";
import Footer from "@/components/footer/Footer";
import PortfolioAgent from "@/components/agent/PortfolioAgent";
import {
  getSiteProfile,
  getTestimonials,
  getTechStack,
  getBlogPosts,
  getProjects,
  getExperience,
} from "@/lib/firestore";

export default async function Home() {
  const [profile, testimonials, techStack, blogPosts, projects, experience] =
    await Promise.all([
      getSiteProfile(),
      getTestimonials(true),
      getTechStack(),
      getBlogPosts(5, true),
      getProjects(true),
      getExperience(),
    ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sim.dev";
  const allSkills = techStack.flatMap((group) => group.items);
  const sameAsLinks = [
    profile?.linkedinUrl,
    profile?.githubUrl,
  ].filter(Boolean);
  const profileName = profile?.heroName || "Simeon Akinrinola";
  const profileRole = profile?.heroSubtitle || "Software Engineer & AI Engineer";

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${siteUrl}/#person`,
        name: profileName,
        jobTitle: profileRole,
        url: siteUrl,
        sameAs: sameAsLinks,
        knowsAbout: allSkills,
        description: profileRole,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profileName} Portfolio`,
        publisher: {
          "@id": `${siteUrl}/#person`,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background-default)] text-[var(--color-text-primary)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar profile={profile} />
      <main className="flex-1 max-w-[var(--container-portfolio)] w-full mx-auto px-[var(--spacing-5)] md:px-[var(--spacing-8)]">
        <Hero profile={profile} />
        <FeaturedProjects projects={projects} />
        <WorkExperience experience={experience} />
        <Testimonials testimonials={testimonials} />
        <TechStack techStack={techStack} />
        <LatestBlogs posts={blogPosts} />
        <Footer profile={profile} />
      </main>
      <PortfolioAgent />
    </div>
  );
}
