import type {Metadata,MetadataRoute} from 'next';
export const SITE_URL='https://jaiminjariwala.netlify.app';
export const SITE_NAME='Jaimin Jariwala';
export const HOME_TITLE='Jaimin Jariwala — Software Engineer';
export const SITE_DESCRIPTION='Jaimin Jariwala is a software engineer building desktop apps, web experiences, and backend systems. Explore his projects, experience, education, and travels.';
export const sectionPaths={intro:'/',gallery:'/gallery',experience:'/experience',education:'/education',projects:'/projects'};
export type PortfolioSection=keyof typeof sectionPaths;
export type StampKind='car'|'rocket'|'experience'|'education'|'projects'|'skills';
export const sectionDescriptions={
  projects:'Software projects by Jaimin Jariwala: Codex Lite for macOS, an open-source component library, and a Go URL shortener with PostgreSQL and Redis.',
  experience:'Explore Jaimin Jariwala’s software engineering and AI/ML experience at Amazon, Logicwind, and The George Washington University.',
  education:'Jaimin Jariwala’s education: a master’s in Computer Science at The George Washington University and a B.Tech. from Parul University.',
  gallery:'Travel photographs and moments from Jaimin Jariwala’s visits to Seattle, Washington D.C., Virginia, and Baltimore.',
};

export const absoluteUrl=(path:string)=>new URL(path,SITE_URL).href;
export const isDeployPreview=(context=process.env.CONTEXT)=>context!==undefined&&['deploy-preview','branch-deploy'].includes(context);

export function pageMetadata(path:string,title:string|{absolute:string},description:string){
  const displayTitle=typeof title==='string'?(title===HOME_TITLE?title:`${title} | ${SITE_NAME}`):title.absolute;
  return {
    title,description,alternates:{canonical:absoluteUrl(path)},
    openGraph:{type:'website',url:absoluteUrl(path),siteName:SITE_NAME,locale:'en_US',title:displayTitle,description,images:[{url:absoluteUrl('/opengraph-image'),width:1200,height:630,alt:HOME_TITLE}]},
    twitter:{card:'summary_large_image',title:displayTitle,description,images:[absoluteUrl('/opengraph-image')]},
  } satisfies Metadata;
}

export const identityGraph={
  '@context':'https://schema.org',
  '@graph':[
    {'@type':'Person','@id':`${SITE_URL}/#person`,name:SITE_NAME,givenName:'Jaimin',additionalName:'Mukesh',familyName:'Jariwala',alternateName:['Jaimin Mukesh Jariwala','jaiminjariwala'],url:`${SITE_URL}/`,jobTitle:'Software Engineer',description:SITE_DESCRIPTION,sameAs:['https://github.com/jaiminjariwala','https://www.linkedin.com/in/jaiminjariwala/']},
    {'@type':'WebSite','@id':`${SITE_URL}/#website`,url:`${SITE_URL}/`,name:SITE_NAME,alternateName:'jaiminjariwala',inLanguage:'en-US',publisher:{'@id':`${SITE_URL}/#person`}},
  ],
} as const;
export const profilePageGraph={
  '@context':'https://schema.org','@type':'ProfilePage','@id':`${SITE_URL}/#profile`,url:`${SITE_URL}/`,name:HOME_TITLE,description:SITE_DESCRIPTION,isPartOf:{'@id':`${SITE_URL}/#website`},mainEntity:{'@id':`${SITE_URL}/#person`},
};
export const jsonLd=(data:unknown)=>JSON.stringify(data).replace(/</g,'\\u003c');

export function sitemapEntries(photoSections:readonly {slug:string}[]=[]):MetadataRoute.Sitemap{
  return [...Object.values(sectionPaths),...photoSections.map(section=>`/gallery/${section.slug}`)].map(path=>({url:absoluteUrl(path)}));
}
export function crawlerRules(context?:string){
  return isDeployPreview(context)
    ? {rules:{userAgent:'*',disallow:'/'}}
    : {rules:{userAgent:'*',allow:'/',disallow:'/api/'},sitemap:absoluteUrl('/sitemap.xml')};
}
