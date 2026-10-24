import {crawlerRules} from '@/lib/siteSeo.mjs';

export default function robots(){return crawlerRules(process.env.CONTEXT);}
