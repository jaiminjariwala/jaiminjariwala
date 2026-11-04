import type {ContributionDay,ContributionsPayload} from '@/types/api';

export function compactContributionWeeks(days:readonly ContributionDay[],count:number|'all'=17){
  const sorted=days.filter(day=>/^\d{4}-\d{2}-\d{2}$/.test(day.date)&&Number.isFinite(Date.parse(`${day.date}T00:00:00Z`))).toSorted((a,b)=>a.date.localeCompare(b.date));
  if(!sorted.length)return [];
  const end=new Date(`${sorted.at(-1)!.date}T00:00:00Z`);
  const lastSunday=new Date(end);lastSunday.setUTCDate(end.getUTCDate()-end.getUTCDay());
  const firstSunday=new Date(`${sorted[0].date}T00:00:00Z`);firstSunday.setUTCDate(firstSunday.getUTCDate()-firstSunday.getUTCDay());
  const weekCount=count==='all'?Math.round((lastSunday.getTime()-firstSunday.getTime())/(7*86400000))+1:count;
  const start=new Date(lastSunday);start.setUTCDate(start.getUTCDate()-(weekCount-1)*7);
  const byDate=new Map(sorted.map(day=>[day.date,day]));
  return Array.from({length:weekCount},(_,column)=>Array.from({length:7},(_,row)=>{
    const date=new Date(start);date.setUTCDate(start.getUTCDate()+column*7+row);
    return date>end?null:byDate.get(date.toISOString().slice(0,10))??null;
  }));
}

let cached:ContributionsPayload|null=null;
let pending:Promise<ContributionsPayload>|null=null;
let fetchedAt=0;
// Reuse the existing portfolio endpoint; never invent contribution counts.
export function loadHoverContributions(){
  if(cached&&Date.now()-fetchedAt<15*60*1000)return Promise.resolve(cached);
  if(pending)return pending;
  pending=(async()=>{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),12000);
    try{
      const response=await fetch('/api/github-contributions',{signal:controller.signal});
      if(!response.ok)throw new Error('GitHub activity unavailable');
      const payload:ContributionsPayload=await response.json();
      if(!Array.isArray(payload.contributions))throw new Error('Invalid GitHub activity');
      cached=payload;fetchedAt=Date.now();return payload;
    }finally{clearTimeout(timeout);pending=null;}
  })();
  return pending;
}
