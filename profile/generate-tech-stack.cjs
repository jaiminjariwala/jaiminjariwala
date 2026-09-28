const fs=require('node:fs/promises');
const path=require('node:path');
const revision='7330accdbc47e2dc0c19789a48533c4a3c50fe58';
const groups=[
 ['languages','Languages',[['TypeScript','typescript/typescript-original'],['Python','python/python-original'],['Go','go/go-original'],['JavaScript','javascript/javascript-original'],['SQL','@database']]],
 ['frontend','Frontend',[['React.js','react/react-original'],['Next.js','nextjs/nextjs-original'],['Redux','redux/redux-original'],['React Native','react/react-original'],['Electron','electron/electron-original']]],
 ['styling-build','Styling & Build',[['HTML5','html5/html5-original'],['CSS3','css3/css3-original'],['Tailwind CSS','tailwindcss/tailwindcss-original'],['Vite','vitejs/vitejs-original']]],
 ['backend','Backend',[['Node.js','nodejs/nodejs-original'],['Express','express/express-original'],['REST APIs','@api'],['GraphQL','graphql/graphql-plain'],['gRPC','grpc/grpc-original'],['Webhooks','@webhook'],['Kafka','apachekafka/apachekafka-original']]],
 ['databases','Databases',[['MongoDB','mongodb/mongodb-original'],['Redis','redis/redis-original'],['Supabase','supabase/supabase-original'],['PostgreSQL','postgresql/postgresql-original']]],
 ['cloud-devops','Cloud & DevOps',[['AWS','amazonwebservices/amazonwebservices-original-wordmark'],['Docker','docker/docker-original'],['Kubernetes','kubernetes/kubernetes-plain'],['CI/CD','@cycle'],['Linux','linux/linux-original'],['Git','git/git-original'],['Vercel','vercel/vercel-original'],['Netlify','netlify/netlify-original'],['Render','@cloud']]],
];
const paths={database:'M4 6c0-5 16-5 16 0s-16 5-16 0v12c0 5 16 5 16 0V6M4 12c0 5 16 5 16 0',api:'m8 6-6 6 6 6m8-12 6 6-6 6m-3-14-2 16',webhook:'M7 7a4 4 0 1 1 7 2l-3 6m4 4a4 4 0 1 0 2-7H9M5 14a4 4 0 1 0 5 6L6 9',key:'M10 14a6 6 0 1 1 4-4l-9 9H2v-3l8-8',cycle:'M20 8a9 9 0 0 0-16-2L2 9m0-6v6h6m-4 7a9 9 0 0 0 16 2l2-3m0 6v-6h-6',cloud:'M7 19h12a4 4 0 0 0 0-8 7 7 0 0 0-13-2 5 5 0 0 0 1 10Z',brain:'M12 3v18M12 5C3-2 0 10 6 11c-8 5 0 14 6 7m0-13c9-7 12 5 6 6 8 5 0 14-6 7M6 7l6 3 6-3M6 16l6-3 6 3',audio:'M3 10v4m4-8v12m5-16v20m5-16v12m4-8v4',tree:'M12 3v9M4 21v-9h16v9M9 3h6v5H9ZM1 17h6v5H1Zm8 0h6v5H9Zm8 0h6v5h-6Z',boxes:'M2 3h8v8H2Zm12 0h8v8h-8ZM2 15h8v8H2Zm12 0h8v8h-8Z',system:'M8 2h8v6H8ZM2 16h8v6H2Zm12 0h8v6h-8ZM12 8v4H6v4m6-4h6v4'};
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
async function icon(id){
 if(id.startsWith('@')) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${paths[id.slice(1)]}" fill="none" stroke="#4776cc" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
 const url=id==='ollama/ollama-original' ? 'https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/ollama.svg' : `https://raw.githubusercontent.com/devicons/devicon/${revision}/icons/${id}.svg`;
 const res=await fetch(url); if(!res.ok) throw Error(`${res.status} ${url}`); return res.text();
}
async function main(){
 const out=path.join(__dirname,'assets','tech-stack'); await fs.mkdir(out,{recursive:true});
 for(const [slug,title,items] of groups){
  const columns=items.length>7?5:items.length, rows=Math.ceil(items.length/columns), width=960, cell=width/columns, height=rows*130;
  const tiles=await Promise.all(items.map(async([name,id],i)=>{
   const x=(i%columns)*cell,y=Math.floor(i/columns)*130;
   const data=Buffer.from(await icon(id)).toString('base64');
   const darkStyle=['Next.js','Express','Kafka','Vercel'].includes(name) ? ' class="mono"' : '';
   return `<g><rect class="tile" x="${x}" y="${y}" width="${cell}" height="130"/><image${darkStyle} href="data:image/svg+xml;base64,${data}" x="${x+cell/2-30}" y="${y+15}" width="60" height="60"/><text x="${x+cell/2}" y="${y+107}" text-anchor="middle" font-size="${name.length>22?15:18}">${esc(name)}</text></g>`;
  }));
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}"><style>text{font-family:Arial,sans-serif;fill:#24292f}.tile{fill:none;stroke:#d0d7de}@media(prefers-color-scheme:dark){text{fill:#e6edf3}.tile{stroke:#30363d}.mono{filter:invert(1)}}</style>${tiles.join('')}</svg>`;
  await fs.writeFile(path.join(out,`${slug}.svg`),svg); console.log(slug,items.length);
 }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
