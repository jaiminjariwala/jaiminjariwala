const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
// GitHub selects the variant using its page theme. SVG media queries can follow
// Safari's system preference instead, making a light GitHub page unreadable.
const style=(theme='light')=>`<style>text{font-family:Arial,sans-serif;fill:${theme==='dark'?'#e6edf3':'#24292f'}}.title{fill:#3182ed;font-weight:700}.muted{fill:${theme==='dark'?'#9198a1':'#656d76'}}.border{stroke:${theme==='dark'?'#3d444d':'#d0d7de'};fill:none}</style>`;
const wrap=(w,h,body,theme)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${style(theme)}${body}</svg>`;
function languages(totals,theme='light'){
 let entries=Object.entries(totals).filter(([,n])=>n>0).sort((a,b)=>b[1]-a[1]);
 const total=entries.reduce((s,[,n])=>s+n,0);
 if(entries.length>10) entries=[...entries.slice(0,9),['Other',entries.slice(9).reduce((s,[,n])=>s+n,0)]];
 const colors={TypeScript:'#3178c6',JavaScript:'#f1e05a',Python:'#3572a5',Go:'#00add8',HTML:'#e34c26',CSS:'#563d7c','Jupyter Notebook':'#da5b0b',Shell:'#89e051',Java:'#b07219',Rust:'#dea584',Other:'#8c959f'};
 const palette=['#267f99','#8250df','#15803d','#c026d3','#bc4c00'];
 const height=170+Math.ceil(entries.length/2)*36;
 let x=30;
 let body='<rect class="border" x="1" y="1" width="648" height="'+(height-2)+'" rx="9"/><text class="title" x="30" y="48" font-size="29">Languages by lines of code</text><defs><clipPath id="bar"><rect x="30" y="78" width="590" height="15" rx="7"/></clipPath></defs>';
 entries.forEach(([name,n],i)=>{
  const color=colors[name]||palette[i%palette.length],w=590*n/total;
  body+=`<rect clip-path="url(#bar)" x="${x}" y="78" width="${w}" height="15" fill="${color}"/>`;x+=w;
  const lx=30+(i%2)*305,ly=132+Math.floor(i/2)*36;
  body+=`<circle cx="${lx+8}" cy="${ly-6}" r="7" fill="${color}"/><text x="${lx+24}" y="${ly}" font-size="17">${esc(name)} ${(100*n/total).toFixed(2)}%</text>`;
 });
 if(!total)body+='<text x="30" y="130" font-size="18">No public language data yet.</text>';
 body+=`<text class="muted" x="30" y="${height-24}" font-size="13">Public source code · dependencies, comments and blank lines excluded</text>`;
 return wrap(650,height,body,theme);
}
module.exports={languages,style};
