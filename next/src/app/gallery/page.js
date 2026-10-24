import PortfolioV2 from "@/components/PortfolioV2";
import {pageMetadata,sectionDescriptions} from '@/lib/siteSeo.mjs';

export const metadata=pageMetadata('/gallery','Travel & Photography',sectionDescriptions.gallery);

export default function Gallery() {
  return <PortfolioV2 initialPage="gallery"/>;
}
