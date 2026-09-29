const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
const style='<style>text{font-family:Arial,sans-serif;fill:#24292f}.title{fill:#3182ed;font-weight:700}.muted{fill:#656d76}.bar{fill:#24292f}.border{stroke:#d0d7de;fill:none}@media(prefers-color-scheme:dark){text{fill:#e6edf3}.muted{fill:#9198a1}.bar{fill:#e6edf3}.border{stroke:#3d444d}}</style>';
const wrap=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${style}${body}</svg>`;
function commits(counts){
 const total=counts.reduce((a,b)=>a+b,0), title=counts[0]+counts[1]>=counts[2]+counts[3]?"I'm an early 🐤":"I'm a night owl 🦉";
 return wrap(800,270,`<text class="title" x="20" y="36" font-size="28">${esc(title)}</text>`+counts.map((n,i)=>{
  const y=82+i*42,p=total?n/total:0;
  return `<text x="20" y="${y}" font-size="22">${['🌞 Morning','🌇 Daytime','🌆 Evening','🌙 Night'][i]}</text><text x="220" y="${y}" font-size="21">${n} commits</text><rect x="390" y="${y-18}" width="280" height="20" rx="3" fill="none" stroke="#8c959f"/><rect class="bar" x="390" y="${y-18}" width="${280*p}" height="20" rx="3"/><text x="695" y="${y}" font-size="21">${(100*p).toFixed(1)}%</text>`;
 }).join('')+'<text class="muted" x="20" y="252" font-size="14">Public indexed commits · Eastern time · 6am / noon / 6pm / midnight</text>');
}
function languages(totals){
 let entries=Object.entries(totals).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
 const total=entries.reduce((s,[,n])=>s+n,0);
 if(entries.length>10) entries=[...entries.slice(0,9),['Other',entries.slice(9).reduce((s,[,n])=>s+n,0)]];
 const colors={TypeScript:'#3178c6',JavaScript:'#f1e05a',Python:'#3572a5',Go:'#00add8',HTML:'#e34c26',CSS:'#563d7c','Jupyter Notebook':'#da5b0b',Shell:'#89e051',Java:'#b07219',Rust:'#dea584',Other:'#8c959f'};
 const palette=['#267f99','#8250df','#15803d','#c026d3','#bc4c00'];
 const height=170+Math.ceil(entries.length/2)*36;
 let x=30;
 let body='<rect class="border" x="1" y="1" width="648" height="'+(height-2)+'" rx="9"/><text class="title" x="30" y="48" font-size="29">Most Used Languages</text><defs><clipPath id="bar"><rect x="30" y="78" width="590" height="15" rx="7"/></clipPath></defs>';
 entries.forEach(([name,n],i)=>{
  const color=colors[name]||palette[i%palette.length],w=590*n/total;
  body+=`<rect clip-path="url(#bar)" x="${x}" y="78" width="${w}" height="15" fill="${color}"/>`;x+=w;
  const lx=30+(i%2)*305,ly=132+Math.floor(i/2)*36;
  body+=`<circle cx="${lx+8}" cy="${ly-6}" r="7" fill="${color}"/><text x="${lx+24}" y="${ly}" font-size="17">${esc(name)} ${(100*n/total).toFixed(2)}%</text>`;
 });
 if(!total)body+='<text x="30" y="130" font-size="18">No public language data yet.</text>';
 body+=`<text class="muted" x="30" y="${height-24}" font-size="13">Code bytes in owned public repositories · forks excluded</text>`;
 return wrap(650,height,body);
}
module.exports={commits,languages};
