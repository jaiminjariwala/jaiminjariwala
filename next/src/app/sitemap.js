import {sitemapEntries} from '@/lib/siteSeo.mjs';
import {photoSections} from '@/components/galleryData';

export default function sitemap(){return sitemapEntries(photoSections);}
