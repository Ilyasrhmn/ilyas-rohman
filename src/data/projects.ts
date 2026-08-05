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
      "Nutrio connects schools, catering kitchens, vendors, and ingredient suppliers for Indonesia's Makanan Bergizi Gratis (MBG) free-meal program, tracking every meal in real time so it stays hygienic, nutritionally balanced, and traceable back to its source.",
    achievement:
      "Digdaya X Hackathon 2026 — Top 480 Practitioner Training, advancing to Top 80 finalist selection.",
    contributions: [
      "Developed responsive interfaces for marketplace, procurement, inventory, and operational modules across multiple user roles.",
      "Integrated frontend modules with REST APIs, replacing mock data with live backend services while improving UI states and application reliability.",
      "Implemented Progressive Web App (PWA) features including QR code workflows, camera integration, and mobile-first experiences for field operators.",
      "Built reusable frontend components and standardized UI architecture to support scalable and consistent user interfaces.",
    ],
    image: "/projects/nutrio.png",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "NestJS", "PostgreSQL", "PWA"],
    demo: "https://nutrio-web.vercel.app/",
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
      "Muterin predicts motorcycle maintenance schedules from actual riding distance, fuel efficiency, and document validity instead of fixed calendar intervals, paired with a community navigation layer for hazard reporting and real-time route planning.",
    achievement: "AMICTA 2026 Nominee — Information System Application Category.",
    contributions: [
      "Developed a motorcycle maintenance platform that predicts service schedules based on real riding distance, fuel efficiency, and vehicle document validity instead of fixed calendar intervals.",
      "Designed and implemented service-layer architecture with 11 dedicated services, separating business logic from controllers to improve maintainability and testability.",
      "Built community-driven navigation features including hazard reporting, route safety detection, saved locations, and real-time route planning using OpenRouteService and Leaflet.",
      "Implemented Progressive Web App (PWA), Google OAuth authentication, PDF reporting, interactive dashboards, and integrated third-party APIs to enhance user experience.",
    ],
    image: "/projects/muterin.png",
    stack: ["Laravel", "PHP", "MySQL", "Leaflet", "Alpine.js", "GSAP", "Lenis", "PWA"],
    demo: "https://muterinid-production.up.railway.app/",
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
    contributions: [
      "Built reusable React components and responsive layouts using Astro, Tailwind CSS, and shadcn/ui.",
      "Designed end-to-end shopping flows including product browsing, wishlist, cart, checkout, and membership pages.",
      "Leveraged Astro's static rendering architecture to build a lightweight frontend prototype and simplify deployment on Netlify.",
    ],
    image: "/projects/nocap.png",
    stack: ["Astro", "React", "TypeScript", "Tailwind CSS", "shadcn/ui", "Netlify"],
    demo: "https://nocapisme.netlify.app/",
    featured: false,
  },
  {
    slug: "portfolio",
    title: "Portfolio",
    category: "Portfolio",
    year: "2026",
    status: "shipped",
    summary: "This site — an interactive frontend portfolio with scroll-driven storytelling and a full motion system.",
    description:
      "The site you're looking at right now. Built to demonstrate scroll-orchestrated motion end to end: GSAP ScrollTrigger synchronized with Lenis smooth scroll, a physics-simulated 3D interaction, and a dual-theme scroll-scrubbed color system, all on typed content data with zero CMS.",
    contributions: [
      "Designed and developed an interactive developer portfolio featuring scroll-driven storytelling, synchronized GSAP ScrollTrigger with Lenis smooth scrolling, and cinematic page transitions.",
      "Built immersive user experiences using physics-based 3D interactions (React Three Fiber & Rapier), parallax effects, and reusable motion components.",
      "Developed reusable UI components and modular page architecture using the Next.js App Router with typed content management.",
      "Created consistent user flows and responsive interfaces through a reusable design system, improving maintainability across the application.",
    ],
    image: "/projects/portfolio.png",
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GSAP", "Framer Motion", "Lenis", "Three.js"],
    demo: "https://ilyas-rohman.vercel.app",
    repo: "https://github.com/Ilyasrhmn/ilyas-rohman",
    featured: false,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
