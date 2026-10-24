import PortfolioV2 from "@/components/PortfolioV2";
import StructuredData from '@/components/StructuredData';
import {pageMetadata,HOME_TITLE,SITE_DESCRIPTION,profilePageGraph} from '@/lib/siteSeo.ts';

export const metadata=pageMetadata('/',{absolute:HOME_TITLE},SITE_DESCRIPTION);

export default function Home() {
  return <><StructuredData data={profilePageGraph}/><PortfolioV2 /></>;
}
