import test from 'node:test';
import assert from 'node:assert/strict';
import {compactContributionWeeks,loadHoverContributions} from './githubHoverCalendar';

test('compact history retains Sunday rows, the latest week, and no fabricated future days',()=>{
  const days=Array.from({length:130},(_,i)=>{const date=new Date('2026-06-28T00:00:00Z');date.setUTCDate(date.getUTCDate()+i);return {date:date.toISOString().slice(0,10),count:i,level:i%5};});
  const weeks=compactContributionWeeks(days);
  assert.equal(weeks.length,17);
  assert.equal(weeks[0][0]?.date,'2026-07-12');
  assert.equal(weeks.at(-1)?.[3]?.date,'2026-11-04');
  assert.deepEqual(weeks.at(-1)?.slice(4),[null,null,null]);
  assert.equal(weeks.at(-1)?.[3]?.count,129);
});

test('empty and missing dates remain empty rather than manufacturing activity',()=>{
  assert.deepEqual(compactContributionWeeks([]),[]);
  const weeks=compactContributionWeeks([{date:'2026-11-04',count:4,level:2}],1);
  assert.deepEqual(weeks[0].map(day=>day?.count??null),[null,null,null,4,null,null,null]);
});

test('history is sorted without mutating input and crosses year boundaries in UTC',()=>{
  const days=[{date:'2026-01-02',count:2,level:1},{date:'2025-12-28',count:1,level:1}];
  const weeks=compactContributionWeeks(days,1);
  assert.equal(weeks[0][0]?.date,'2025-12-28');assert.equal(weeks[0][5]?.date,'2026-01-02');
  assert.equal(days[0].date,'2026-01-02');
});

test('full history retains both endpoints and missing days across multiple years',()=>{
  const days=[{date:'2024-10-01',count:5,level:2},{date:'2026-11-04',count:9,level:3}];
  const weeks=compactContributionWeeks(days,'all');
  assert.equal(weeks.length,110);
  assert.equal(weeks[0][2]?.date,'2024-10-01');
  assert.equal(weeks.at(-1)?.[3]?.date,'2026-11-04');
  assert.equal(weeks.flat().filter(Boolean).length,2);
  assert.deepEqual(weeks.at(-1)?.slice(4),[null,null,null]);
});

test('hover requests coalesce, retry failures, and cache the real response',async t=>{
  const original=globalThis.fetch;t.after(()=>{globalThis.fetch=original;});
  let calls=0;
  globalThis.fetch=async()=>{calls++;return new Response('{}',{status:503});};
  await assert.rejects(loadHoverContributions(),/unavailable/);
  const payload={username:'jaiminjariwala',profileUrl:'https://github.com/jaiminjariwala',range:{from:'2026-11-04',to:'2026-11-04'},contributions:[{date:'2026-11-04',count:3,level:1}],updatedAt:new Date().toISOString()};
  globalThis.fetch=async input=>{assert.equal(input,'/api/github-contributions');calls++;return Response.json(payload);};
  const first=loadHoverContributions(),second=loadHoverContributions();
  assert.equal(first,second);assert.deepEqual(await first,payload);
  assert.deepEqual(await loadHoverContributions(),payload);assert.equal(calls,2);
});
