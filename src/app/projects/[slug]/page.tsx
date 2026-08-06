import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject } from "@/data/projects";
import { ProjectDetail } from "@/components/projects/project-detail";
import { NextProject } from "@/components/projects/next-project";
import { ProjectsFooter } from "@/components/projects/footer";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.title} — Ilyas Nur Rohman`,
    description: project.summary,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[var(--world-a-bg)]">
      <div className="px-6 pb-16 pt-32 sm:px-10 md:pt-40">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/projects"
            className="inline-flex min-h-[44px] items-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--world-a-muted)] transition-colors hover:text-[var(--world-a-accent)]"
          >
            &larr; Back to projects
          </Link>
        </div>
        <div className="mt-8">
          <ProjectDetail project={project} />
        </div>
        <NextProject currentSlug={slug} />
      </div>
      <ProjectsFooter />
    </div>
  );
}
