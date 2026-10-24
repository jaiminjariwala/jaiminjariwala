import {crawlerRules} from '@/lib/siteSeo.ts';

export default function robots(){return crawlerRules(process.env.CONTEXT);}
