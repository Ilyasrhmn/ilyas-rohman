import type { Project } from "@/types";

export const projects: Project[] = [
  {
    slug: "marketplace-desa",
    title: "Marketplace Desa",
    category: "Web App",
    year: "2026",
    status: "building",
    summary: "A marketplace connecting village producers to buyers.",
    description:
      "Currently building. Problem, approach, and stack will be documented here as the project progresses.",
    image: "/projects/placeholder.svg",
    stack: ["Next.js", "Laravel", "MySQL"],
    featured: true,
  },
  {
    slug: "hackathon-project-1",
    title: "Hackathon Project",
    category: "Hackathon",
    year: "2025",
    status: "shipped",
    summary: "Replace with the real hackathon project name and one-line pitch.",
    description:
      "Replace with the problem statement, your role, the approach taken, and the outcome/result from the hackathon.",
    image: "/projects/placeholder.svg",
    stack: ["Next.js", "TypeScript"],
    featured: true,
  },
  {
    slug: "campus-project-1",
    title: "Campus Project",
    category: "Coursework",
    year: "2025",
    status: "shipped",
    summary: "Replace with the real campus/coursework project name and pitch.",
    description:
      "Replace with what the assignment/project required, what you built, and what you learned.",
    image: "/projects/placeholder.svg",
    stack: ["React", "TypeScript"],
    featured: false,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
