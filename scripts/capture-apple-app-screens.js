import { chromium } from '@playwright/test';
import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'store-assets','apple-source');
await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--enable-webgl','--use-angle=swiftshader']});
const page=await browser.newPage({viewport:{width:430,height:932},deviceScaleFactor:2});
await page.goto('http://127.0.0.1:3000/'); await page.waitForTimeout(5000);
for(const lang of ['tr','en']){
 await page.evaluate(l=>{localStorage.setItem('lms_lang',l);localStorage.setItem('lms_onboarding_done','1');localStorage.setItem('lms_guest_used','{}');window.setLanguage?.(l)},lang);
 const only=id=>page.evaluate(id=>{for(const el of document.querySelectorAll('body>div'))el.style.display='none';document.getElementById(id).style.display=id==='game-container'?'flex':'block'},id);
 const actions=[
  async()=>{await only('game-container');await page.evaluate(l=>{document.getElementById('topicOverlay').style.display='none';document.getElementById('therapyMainCard').style.display='block';document.querySelectorAll('.therapy-session-ui').forEach(x=>x.style.display='');document.getElementById('qBar').textContent=l==='en'?'What made you happy today?':'Bugün seni ne mutlu etti?';document.getElementById('micBtn').disabled=false;const s=document.getElementById('therapySideCard');s.style.display='block';if(!s.querySelector('.store-shot-avatar'))s.insertAdjacentHTML('afterbegin','<img class="store-shot-avatar" src="avatar.png" style="width:180px;height:180px;border-radius:50%;object-fit:cover;display:block;margin:20px auto">')},lang)},
  ()=>page.evaluate(()=>window.goToAac()),
  async()=>{await only('object-screen');await page.evaluate(()=>{const c=document.getElementById('objectCanvas');if(c)c.style.display='none';const f=document.getElementById('objFallback');if(f){f.style.display='flex';f.textContent='✈️';f.style.fontSize='170px'}document.getElementById('objProgress').textContent='1 / 3'})},
  async()=>{await only('analysis-screen');await page.evaluate(()=>{document.querySelectorAll('.az-metric-fill').forEach((x,i)=>x.style.width=['78%','64%','22%','18%'][i%4]);document.querySelectorAll('.az-metric-value').forEach((x,i)=>x.textContent=['78%','64%','22%','18%'][i%4])})},
  async()=>{await page.evaluate(()=>window.goToSchedule());await page.evaluate(()=>{document.querySelectorAll('.task-progress-fill').forEach((x,i)=>x.style.width=i?'67%':'100%');document.querySelectorAll('.task-progress-text').forEach((x,i)=>x.textContent=i?'4 / 6':'1 / 1')})},
  async()=>{await page.evaluate(()=>window.goToStore());await page.evaluate(()=>document.getElementById('storeBalance').textContent='⭐ 46')},
  ()=>only('auth-screen')
 ];
 for(let i=0;i<7;i++){try{await actions[i]()}catch{}await page.evaluate(()=>document.querySelectorAll('.recovery-modal-overlay,.aac-search-overlay,.student-modal-overlay,.confirm-modal-overlay').forEach(x=>x.style.display='none'));await page.waitForTimeout(600);await page.screenshot({path:path.join(out,`apple-source-${lang}-${String(i+1).padStart(2,'0')}.png`),animations:'disabled'})}
}
await browser.close();
