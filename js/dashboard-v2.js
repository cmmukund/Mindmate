import { all } from './storage.js';
import { allBaselines } from './adaptive-engine.js';
import { adherence } from './reminder-engine.js';
import { queueCount } from './sync-queue.js';

export async function refreshV2Dashboard(){
 const sessions=await all('sessions'); const b=await allBaselines(); const ad=await adherence(); const q=await queueCount();
 const scoreEl=document.getElementById('score'); const careScore=document.getElementById('careScore');
 const established=Object.values(b).filter(x=>x.established); const avg=established.length?Math.round(established.reduce((s,x)=>s+x.score,0)/established.length*100):null;
 if(scoreEl) scoreEl.textContent=avg==null?'—':`${avg}%`; if(careScore) careScore.textContent=avg==null?'—':`${avg}%`;
 const bar=document.getElementById('performanceBar'), txt=document.getElementById('performanceText'); if(bar&&avg!=null)bar.style.width=`${avg}%`; if(txt)txt.textContent=avg==null?'Baseline pending':`${avg}%`;
 const syncEls=document.querySelectorAll('[data-v2-sync]'); syncEls.forEach(e=>e.textContent=q?`${q} waiting to sync`:'All local events synced');
 const adEl=document.querySelector('[data-v2-adherence]'); if(adEl)adEl.textContent=ad.rate==null?'No completed reminder history':`${Math.round(ad.rate*100)}% completed`;
 const care=document.querySelector('[data-v2-care-explanation]'); if(care){const item=Object.entries(b).find(([,v])=>v.established&&v.score<.6);care.textContent=item?`${item[0]} activity performance is below the recent personal baseline range; the next task is adjusted to maintain an appropriate challenge.`:'No current adaptive attention note. More sessions will improve personalization.';}
}
