import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const source=readFileSync(new URL('./PortfolioV2.tsx',import.meta.url),'utf8');
const css=readFileSync(new URL('./PortfolioV2.module.css',import.meta.url),'utf8');

test('the Engineering continuation starts a new desktop line without forcing a mobile break',()=>{
  assert.ok(source.includes('"Bachelor of Technology in Computer Science and Engineering"'));
  assert.ok(source.includes('const continuation=" and Engineering"'));
  assert.ok(source.includes('degree.slice(0,-continuation.length)'));
  assert.ok(source.includes('<span className={styles.degreeContinuation}>{continuation}</span>'));
  assert.ok(source.includes('<EducationDegree degree={degree}/>'));
  assert.ok(css.includes('.experience .degreeContinuation{display:inline}'));
  assert.ok(css.includes('@media(min-width:761px){.experience .degreeContinuation{display:block}}'));
});

test('the Alexa team is a separate bulleted line after the role',()=>{
  assert.ok(source.includes('<span>{role}</span>{team&&<span className={styles.experienceTeam}>· {team}</span>}'));
  assert.ok(css.includes('.experience .experienceTeam{display:block}'));
  assert.ok(!css.includes('.experience .experienceTeam{display:inline}'));
  assert.ok(!css.includes('.experienceTeam:before'));
});
