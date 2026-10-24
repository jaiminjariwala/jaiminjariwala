import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('./PortfolioV2.jsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');
const collection=source.slice(source.indexOf('aria-label="Stamp collection"'),source.indexOf('<div className={styles.paperShadow}>'));

test('the mobile collection uses one centered column with larger, spaced stamps',()=>{
  assert.match(css,/@media\(max-width:760px\)\{\s*\.stampGrid\{grid-template-columns:minmax\(0,1fr\);padding:0 28px;gap:44px;margin:90px auto 80px\}\s*\.stampGrid \.stamp\{width:min\(62vw,260px\);height:min\(62vw,260px\)\}/);
  assert.ok(css.includes('grid-template-columns:repeat(3,1fr)'),'desktop retains its three-column layout');
  assert.ok(!/\.stampGrid\{[^}]*grid-template-columns:repeat\(2,1fr\)/.test(css.slice(css.lastIndexOf('grid-template-columns:minmax(0,1fr)'))),'later rules must not restore a two-column collection');
});

test('collection captions are removed while every stamp keeps its accessible name',()=>{
  assert.equal((collection.match(/data-stamp-item/g)||[]).length,6);
  assert.ok(!collection.includes('<figcaption>'));
  assert.ok(!collection.includes('comingSoon'));
  for(const label of ['Open travel','Open introduction','Open experience','Open education','Open projects','Skills (adding soon)']){
    assert.ok(collection.includes(`aria-label="${label}"`),label);
  }
});
