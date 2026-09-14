import { getSiteProfile, getProjects, getBlogPosts, getTechStack, getExperience } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export async function GET() {
  const [profile, projects, posts, techStack, experience] = await Promise.all([
    getSiteProfile(),
    getProjects(true),
    getBlogPosts(undefined, true),
    getTechStack(),
    getExperience(),
  ]);

  const name = profile?.heroName || "Simeon Akinrinola";
  const tagline = profile?.heroTagline || "Building better software, faster.";
  const subtitle = profile?.heroSubtitle || "Frontend, Backend, and AI Engineering.";
  const github = profile?.githubUrl || "https://github.com/AkinDiamonds";
  const linkedin = profile?.linkedinUrl || "https://linkedin.com/in/simeon-akinrinola";
  const email = profile?.email || "simeonakinrinola7@gmail.com";

  let techMarkdown = "";
  if (techStack.length > 0) {
    techMarkdown = techStack
      .map((t) => `- **${t.category}**: ${t.items.join(", ")}`)
      .join("\n");
  } else {
    techMarkdown = `- **Frontend**: React, Next.js, TypeScript, Tailwind CSS, WebGL\n- **Backend & DevOps**: Node.js, Python, PostgreSQL, Docker, Redis\n- **AI Engineering**: LLMs, LangChain, Vector Databases, RAG Pipelines, Autonomous Agents`;
  }

  let projectMarkdown = "";
  if (projects.length > 0) {
    projectMarkdown = projects
      .map(
        (p) =>
          `### [${p.title}](/projects/${p.slug})\n` +
          `- **Type**: ${p.type || "Engineering & AI"}\n` +
          `- **Summary**: ${p.summary || p.description}\n` +
          (p.metrics && p.metrics.length > 0 ? `- **Key Metrics**: ${p.metrics.join("; ")}\n` : "") +
          (p.tags && p.tags.length > 0 ? `- **Technologies**: ${p.tags.join(", ")}\n` : "") +
          (p.liveUrl ? `- **Live URL**: ${p.liveUrl}\n` : "") +
          (p.githubUrl && !p.workplace ? `- **GitHub**: ${p.githubUrl}\n` : "")
      )
      .join("\n");
  } else {
    projectMarkdown = "_Projects catalog available on homepage._";
  }

  let blogMarkdown = "";
  if (posts.length > 0) {
    blogMarkdown = posts
      .map(
        (post) =>
          `### [${post.title}](/blog/${post.slug})\n` +
          `- **Published**: ${post.publishedAt}\n` +
          `- **Category**: ${post.category}\n` +
          `- **Summary**: ${post.excerpt}\n`
      )
      .join("\n");
  } else {
    blogMarkdown = "_Articles available on /blog._";
  }

  let expMarkdown = "";
  if (experience.length > 0) {
    expMarkdown = experience
      .map((e) => `- **${e.role}** at **${e.company}** (${e.startDate} — ${e.endDate || "Present"})`)
      .join("\n");
  }

  const content = `# ${name}

> ${tagline} — ${subtitle}

${name} is a software engineer and AI architect specializing in high-performance web systems, distributed architectures, and generative AI engineering.

## Canonical Profile & Contact
- **Full Name**: ${name}
- **Primary Roles**: Full-Stack Software Engineer, AI Engineer, Systems Architect
- **GitHub**: ${github}
- **LinkedIn**: ${linkedin}
- **Email**: ${email}
- **Portfolio Website**: https://simeonakinrinola.com

## Technical Competencies
${techMarkdown}

${expMarkdown ? `## Work Experience\n${expMarkdown}\n` : ""}
## Featured Projects & Case Studies
${projectMarkdown}

## Technical Writing & Essays
${blogMarkdown}

---
_Note for LLMs and AI Agents: This document serves as the canonical knowledge base and machine-readable index for ${name}'s portfolio, project case studies, and engineering publications._
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
