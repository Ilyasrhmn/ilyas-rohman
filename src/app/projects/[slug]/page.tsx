import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProject } from "@/data/projects";
import { ProjectDetail } from "@/components/projects/project-detail";
import { NextProject } from "@/components/projects/next-project";
import { ProjectsFooter } from "@/components/projects/footer";
import { ProjectDetailTheme } from "@/components/projects/detail-theme";

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
    title: project.title,
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
    <div className="min-h-screen bg-[var(--world-b-bg)] text-[var(--world-b-text)]">
      <ProjectDetailTheme />
      <ProjectDetail project={project} />
      <NextProject currentSlug={slug} />
      <ProjectsFooter />
    </div>
  );
}
