import assert from 'node:assert/strict';
import {SITE_URL} from '../src/lib/siteSeo.ts';

async function main(){
const base=process.argv[2]||'http://127.0.0.1:3010';
const pages=[['/','Jaimin Mukesh Jariwala'],['/projects','Codex Lite'],['/experience','Logicwind'],['/education','Parul University'],['/gallery','Travel folders'],['/gallery/seattle','Seattle'],['/gallery/washington-dc','Washington D.C.'],['/gallery/virginia','Virginia'],['/gallery/baltimore','Baltimore']];
const titles=new Set(),descriptions=new Set();
for(const [path,content] of pages){
  const response=await fetch(new URL(path,base)),html=await response.text();
  assert.equal(response.status,200,path);
  const title=html.match(/<title>([^<]+)<\/title>/)?.[1];
  const description=html.match(/<meta name="description" content="([^"]+)"/ )?.[1];
  assert.ok(title?.includes('Jaimin Jariwala'),`${path}: branded title`);
  assert.ok(description&&description.length>70,`${path}: useful description`);
  assert.ok(!titles.has(title),`${path}: unique title`);titles.add(title);
  assert.ok(!descriptions.has(description),`${path}: unique description`);descriptions.add(description);
  assert.ok(html.includes(content),`${path}: content must exist before JavaScript`);
  const canonical=html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  assert.ok(canonical,`${path}: canonical is present`);
  assert.equal(new URL(canonical).href,new URL(path,SITE_URL).href,`${path}: canonical`);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,`${path}: exactly one canonical`);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html),`${path}: indexable`);
  assert.ok(html.includes('name="twitter:card" content="summary_large_image"'),`${path}: share card`);
  const graphs=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  assert.ok(graphs.some(graph=>graph['@graph']?.some((node:Record<string,unknown>)=>node['@type']==='Person')),`${path}: person identity`);
  if(path==='/'){
    assert.ok(graphs.some(graph=>graph['@type']==='ProfilePage'));
    for(const href of ['/projects','/gallery','/experience','/education'])assert.ok(html.includes(`href="${href}"`),`crawlable ${href}`);
  }
  console.log(`PASS ${path}: SSR content, metadata, canonical, structured data`);
}
const robots=await fetch(`${base}/robots.txt`);
assert.equal(robots.status,200);
assert.ok((await robots.text()).includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
const sitemap=await fetch(`${base}/sitemap.xml`),xml=await sitemap.text();
assert.equal(sitemap.status,200);
assert.equal((xml.match(/<loc>/g)||[]).length,pages.length);
for(const [path] of pages)assert.ok(xml.includes(`<loc>${new URL(path,SITE_URL).href}</loc>`));
const image=await fetch(`${base}/opengraph-image`),png=Buffer.from(await image.arrayBuffer());
assert.equal(image.status,200);
assert.ok(image.headers.get('content-type')?.includes('image/png'));
assert.equal(png.readUInt32BE(16),1200);
assert.equal(png.readUInt32BE(20),630);
const missing=await fetch(`${base}/gallery/not-a-real-folder`);
assert.equal(missing.status,404);
assert.ok((await missing.text()).includes('content="noindex"'));
console.log('PASS robots.txt, sitemap.xml, 1200x630 share image, genuine 404/noindex');
}

void main().catch((error: unknown)=>{console.error(error);process.exitCode=1;});
