import { notFound } from "next/navigation";
import PortfolioV2 from "@/components/PortfolioV2";
import { experiencePath, experienceRoles } from "@/components/portfolioExperience";
import { pageMetadata } from "@/lib/siteSeo";

type ExperienceRouteProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return experienceRoles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: ExperienceRouteProps) {
  const { slug } = await params;
  const entry = experienceRoles.find((role) => role.slug === slug);
  if (!entry) notFound();
  return pageMetadata(experiencePath(slug), `${entry.company} Experience`, entry.summary);
}

export default async function ExperienceRolePage({ params }: ExperienceRouteProps) {
  const { slug } = await params;
  if (!experienceRoles.some((role) => role.slug === slug)) notFound();
  return <PortfolioV2 initialPage="experience" experienceSlug={slug} />;
}
