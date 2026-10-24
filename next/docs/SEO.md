# Search visibility for Jaimin Jariwala

Canonical public site: https://jaiminjariwala.netlify.app/

## Implemented

- Distinct server-rendered titles, descriptions, canonical URLs, and social metadata.
- Factual Person, WebSite, and ProfilePage JSON-LD connecting Jaimin Jariwala, Jaimin Mukesh Jariwala, and the handle jaiminjariwala to the existing GitHub/LinkedIn profiles.
- Crawlable section links with real Projects, Experience, Education, Travel, and city URLs. Ordinary clicks retain the paper animation; opening links in a new tab loads the corresponding section directly.
- `/robots.txt` and `/sitemap.xml`; redirects, APIs, and nonexistent folders are excluded. No fabricated last-modified timestamps.
- A server-generated 1200 × 630 social image and noindex settings for Netlify deploy/branch previews.
- No doorway pages, hidden keyword blocks, fake reviews, purchased backlinks, or first-name ranking guarantees.

## After publishing

1. Add a URL-prefix property for `https://jaiminjariwala.netlify.app/` in [Google Search Console](https://search.google.com/search-console/). A Netlify subdomain is not a domain you control at the DNS level, so use URL-prefix verification rather than a DNS domain property.
2. If Google offers HTML-tag verification, set its **public verification token** as the Netlify build environment variable `GOOGLE_SITE_VERIFICATION`, then rebuild and complete verification in Search Console. Never share Google account credentials.
3. Submit `https://jaiminjariwala.netlify.app/sitemap.xml` and use URL Inspection to request indexing for the home page and the key sections. Requests do not guarantee indexing or rankings.
4. Optionally verify Bing Webmaster Tools with the public HTML-tag token in `BING_SITE_VERIFICATION` and submit the same sitemap.
5. Keep the portfolio link and name consistent on the existing GitHub and LinkedIn profiles. Earn relevant links by publishing real project documentation and useful work; do not buy ranking promises.
6. Monitor the actual queries `Jaimin Jariwala`, `Jaimin Mukesh Jariwala`, and `jaiminjariwala` in Search Console. `Jaimin` alone is much broader and competes with unrelated people and meanings.

The domain, external accounts, and search-console submissions were not changed by this implementation. If moving to a custom domain later, update the canonical source in `src/lib/siteSeo.ts`, configure permanent redirects from the old host, and submit the new property/sitemap.

## Verification

```sh
npx tsx --test src/lib/siteSeo.test.ts
npm run build
npm run start -- --port 3010
npm run test:seo -- http://127.0.0.1:3010
```

The integration check requests ordinary HTML without a browser or JavaScript execution. It checks all nine indexable pages, unique metadata, canonicals, crawlable links, JSON-LD, sitemap, robots, share-image dimensions, and real 404/noindex behavior.

## Guidance

- [Google SEO starter guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Crawlable links](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [ProfilePage structured data](https://developers.google.com/search/docs/appearance/structured-data/profile-page)
- [Site names](https://developers.google.com/search/docs/appearance/site-names)
