import {sitemapEntries} from '@/lib/siteSeo.ts';
import {photoSections} from '@/components/galleryData';

export default function sitemap(){return sitemapEntries(photoSections);}
