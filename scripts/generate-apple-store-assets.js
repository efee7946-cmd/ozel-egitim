import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const out=path.join(root,'store-assets');
const browser=await chromium.launch({headless:true});
for(const [device,w,h] of [['iphone-69',1320,2868],['ipad-13',2732,2048]]){
 const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
 for(const lang of ['tr','en']) for(let n=1;n<=7;n++){
  await page.goto(`file:///${path.join(out,'apple-store-generator.html').replaceAll('\\','/')}?n=${n}&l=${lang}&real=1`);
  await page.screenshot({path:path.join(out,`apple-${device}-${lang}-${String(n).padStart(2,'0')}.png`),animations:'disabled'});
 }
 await page.close();
}
await browser.close();
await fs.writeFile(path.join(out,'apple-README.md'),`# Apple App Store screenshot set\n\nCapture with \`npm run store:apple:capture\`, then generate with \`npm run store:apple\`.\n\n- iPhone 6.9-inch: 1320×2868\n- iPad 13-inch landscape: 2732×2048\n- Locales: TR and EN\n- Seven ordered panels per locale/device\n`);
