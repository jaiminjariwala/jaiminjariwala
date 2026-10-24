import PortfolioV2 from "@/components/PortfolioV2";
import {pageMetadata,sectionDescriptions} from '@/lib/siteSeo.ts';

export const metadata=pageMetadata('/projects','Projects',sectionDescriptions.projects);

export default function Projects() {
  return <PortfolioV2 initialPage="projects"/>;
}
