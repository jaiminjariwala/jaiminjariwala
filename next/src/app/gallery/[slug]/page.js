import { notFound } from "next/navigation";
import GalleryFolderPhotosPage from "@/components/GalleryFolderPhotosPage";
import { getSectionBySlug, photoSections } from "@/components/galleryData";

export function generateStaticParams() {
  return photoSections.map((section) => ({ slug: section.slug }));
}

export default async function GalleryFolderRoute({ params }) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);

  if (!section) {
    notFound();
  }

  return <GalleryFolderPhotosPage section={section} />;
}
