import PortfolioV2 from '@/components/PortfolioV2';
import {pageMetadata,sectionDescriptions} from '@/lib/siteSeo.mjs';

export const metadata=pageMetadata('/education','Education',sectionDescriptions.education);

export default function Education(){
  return <PortfolioV2 initialPage="education"/>;
}
