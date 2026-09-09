export function GET() {
  const content = `# Simeon Akinrinola

Simeon Akinrinola, also known as Akin, is a software engineer and AI architect. His portfolio documents work across frontend engineering, backend engineering, and AI-powered product development.

## Canonical profile

- Name: Simeon Akinrinola
- Alias: Akin
- Roles: Software Engineer; Developer; AI Architect
- Expertise: frontend development, backend development, AI engineering, AI architecture
- GitHub: https://github.com/AkinDiamonds
- LinkedIn: https://linkedin.com/in/simeon-akinrinola

## Primary pages

- / — portfolio and selected projects
- /blog — technical writing
`;
  return new Response(content, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
