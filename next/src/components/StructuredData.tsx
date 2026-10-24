import {jsonLd} from '@/lib/siteSeo.ts';

export default function StructuredData({data}:{data:unknown}){
  return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLd(data)}}/>;
}
