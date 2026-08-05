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
    slug: "nutrio",
    title: "Nutrio",
    category: "Hackathon",
    year: "2026",
    status: "shipped",
    summary:
      "Operational platform for Indonesia's Makanan Bergizi Gratis (MBG) program — marketplace, procurement, inventory, and field operations.",
    description:
      "Built for the Bank Indonesia x PIDI Digdaya AI Hackathon 2026, where the team was selected into Practitioner Training (Top 480) and advanced toward the Top 80 finalist round. Developed responsive interfaces across the marketplace, procurement, inventory, and operations modules for multiple user roles, then wired them to real REST APIs in place of mock data. Shipped PWA features — QR workflows, camera integration, mobile-first flows — for operators working in the field.",
    image: "/projects/placeholder.svg",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "PostgreSQL", "PWA"],
    featured: true,
  },
  {
    slug: "muterin",
    title: "Muterin",
    category: "Competition",
    year: "2026",
    status: "shipped",
    summary:
      "Motorcycle maintenance and community navigation platform that predicts service schedules from real riding data.",
    description:
      "Nominee, AMICTA 2026, Information System Application category. Predicts maintenance schedules from actual riding distance, fuel efficiency, and document validity rather than fixed calendar intervals. Backend split into 11 dedicated services to keep business logic out of the controllers. Community navigation layer adds hazard reporting, route-safety detection, and real-time route planning over OpenRouteService and Leaflet, plus Google OAuth, PDF reporting, and an interactive dashboard.",
    image: "/projects/placeholder.svg",
    stack: ["Laravel", "PHP", "MySQL", "Leaflet", "Alpine.js", "GSAP", "Lenis", "PWA"],
    featured: true,
  },
  {
    slug: "nocap",
    title: "NoCap",
    category: "Personal Project",
    year: "2026",
    status: "shipped",
    summary: "Fashion e-commerce frontend prototype — browsing, wishlist, cart, checkout, membership.",
    description:
      "A responsive e-commerce frontend built to explore Astro's static-rendering architecture against a full shopping flow: product browsing, wishlist, cart, checkout, and membership pages, componentized with shadcn/ui and deployed on Netlify.",
    image: "/projects/placeholder.svg",
    stack: ["Astro", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Netlify"],
    featured: false,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
