import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SITE_URL,SITE_NAME,HOME_TITLE,SITE_DESCRIPTION,sectionPaths,sectionDescriptions,pageMetadata,identityGraph,profilePageGraph,jsonLd,sitemapEntries,crawlerRules,isDeployPreview} from './siteSeo.mjs';

test('the name variants are tied to one factual person and public profiles',()=>{
  const person=identityGraph['@graph'].find(node=>node['@type']==='Person');
  assert.equal(person.name,'Jaimin Jariwala');
  assert.equal(person.givenName,'Jaimin');
  assert.ok(person.alternateName.includes('jaiminjariwala'));
  assert.ok(person.alternateName.includes('Jaimin Mukesh Jariwala'));
  assert.deepEqual(person.sameAs,['https://github.com/jaiminjariwala','https://www.linkedin.com/in/jaiminjariwala/']);
  assert.equal(profilePageGraph.mainEntity['@id'],person['@id']);
});

test('each landing page has a distinct title, description, canonical, and share card',()=>{
  const home=pageMetadata('/',{absolute:HOME_TITLE},SITE_DESCRIPTION);
  assert.equal(home.openGraph.title,HOME_TITLE);
  assert.equal(home.alternates.canonical,`${SITE_URL}/`);
  const descriptions=new Set();
  for(const [section,description] of Object.entries(sectionDescriptions)){
    const metadata=pageMetadata(sectionPaths[section],section,description);
    descriptions.add(metadata.description);
    assert.ok(description.includes(SITE_NAME));
    assert.equal(metadata.openGraph.url,metadata.alternates.canonical);
    assert.ok(metadata.alternates.canonical.startsWith(`${SITE_URL}/`));
    assert.equal(metadata.twitter.card,'summary_large_image');
    assert.equal(metadata.openGraph.images[0].width,1200);
    assert.ok(!('keywords' in metadata),'do not use keyword stuffing');
  }
  assert.equal(descriptions.size,4);
});

test('JSON-LD cannot terminate its script element',()=>{
  const encoded=jsonLd({name:'</script><script>alert(1)</script>'});
  assert.ok(!encoded.includes('<'));
  assert.equal(JSON.parse(encoded).name,'</script><script>alert(1)</script>');
});

test('sitemap lists only stable canonical pages, not redirects or API routes',()=>{
  const entries=sitemapEntries([{slug:'seattle'},{slug:'washington-dc'},{slug:'virginia'},{slug:'baltimore'}]);
  assert.equal(entries.length,9);
  assert.equal(new Set(entries.map(entry=>entry.url)).size,9);
  assert.ok(entries.every(entry=>entry.url.startsWith(SITE_URL)));
  assert.ok(entries.every(entry=>!entry.url.includes('/api/')&&!entry.url.includes('/hire-me')));
  assert.ok(entries.every(entry=>!entry.lastModified),'do not claim that every build changes every page');
});

test('production can be crawled and Netlify preview builds are not indexed',()=>{
  assert.equal(crawlerRules('production').rules.allow,'/');
  assert.equal(crawlerRules('production').sitemap,`${SITE_URL}/sitemap.xml`);
  for(const context of ['deploy-preview','branch-deploy']){
    assert.equal(isDeployPreview(context),true);
    assert.equal(crawlerRules(context).rules.disallow,'/');
  }
});

test('links and server entry points expose every animated portfolio section',()=>{
  const portfolio=readFileSync(new URL('../components/PortfolioV2.jsx',import.meta.url),'utf8');
  assert.ok(portfolio.includes('useState(initialPage)'));
  for(const section of ['gallery','projects','experience','education']){
    assert.ok(portfolio.includes(`href={sectionPaths.${section}}`));
    const route=readFileSync(new URL(`../app/${section}/page.js`,import.meta.url),'utf8');
    assert.ok(route.includes(`initialPage="${section}"`));
    assert.ok(route.includes('pageMetadata('));
  }
  assert.ok(portfolio.includes('event.metaKey||event.ctrlKey||event.shiftKey||event.altKey'));
  const folder=readFileSync(new URL('../app/gallery/[slug]/page.js',import.meta.url),'utf8');
  assert.ok(folder.includes('initialGallerySlug={section.slug}'));
  assert.ok(folder.includes('notFound()'));
});
