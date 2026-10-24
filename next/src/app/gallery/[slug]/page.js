import { notFound } from "next/navigation";
import PortfolioV2 from '@/components/PortfolioV2';
import { getSectionBySlug, photoSections } from "@/components/galleryData";
import {pageMetadata} from '@/lib/siteSeo.mjs';

export async function generateMetadata({params}){
  const {slug}=await params,section=getSectionBySlug(slug);
  if(!section)return {};
  return pageMetadata(`/gallery/${section.slug}`,`${section.title} Travel Photos`,`${section.title} travel photographs by Jaimin Jariwala. ${section.photos.length} photos from ${section.dateRange.toLowerCase()}.`);
}

export function generateStaticParams() {
  return photoSections.map((section) => ({ slug: section.slug }));
}

export default async function GalleryFolderRoute({ params }) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  return <PortfolioV2 initialPage="gallery" initialGallerySlug={section.slug}/>;
}
