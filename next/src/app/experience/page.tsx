import PortfolioV2 from '@/components/PortfolioV2';
import {pageMetadata,sectionDescriptions} from '@/lib/siteSeo.ts';

export const metadata=pageMetadata('/experience','Experience',sectionDescriptions.experience);

export default function Experience(){
  return <PortfolioV2 initialPage="experience"/>;
}
