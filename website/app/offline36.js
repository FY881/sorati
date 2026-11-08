(()=>{"use strict";const W=window;if(W.__off36)return;W.__off36=1;
const DB="sp36_off",ST="kv";let db;
function open(){return new Promise((res,rej)=>{if(db)return res(db);if(!W.indexedDB)return rej();const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(ST);r.onsuccess=()=>{db=r.result;res(db)};r.onerror=()=>rej()})}
function tx(m,f){return open().then(d=>new Promise((res,rej)=>{const t=d.transaction(ST,m),s=t.objectStore(ST),q=f(s);t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej()}))}
W.off36={get:k=>tx("readonly",s=>s.get(k)).catch(()=>null),set:(k,v)=>tx("readwrite",s=>s.put(v,k)).catch(()=>null)};
// mirror daily log keys from localStorage to IndexedDB (survives storage eviction), restore if missing
const KEYS=/^(sp_|sp26_|sp30_|sp33_)/;
function snap(){try{const o={};for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(KEYS.test(k)&&!/token|secret|fb_rt/i.test(k))o[k]=localStorage.getItem(k)}W.off36.set("snap",{t:Date.now(),o})}catch(e){}}
async function restore(){try{if(localStorage.length>3)return;const s=await W.off36.get("snap");if(s&&s.o)for(const k in s.o)localStorage.setItem(k,s.o[k])}catch(e){}}
restore();setInterval(snap,60000);addEventListener("pagehide",snap);
// offline banner
function bn(){let b=document.getElementById("off36");if(navigator.onLine){b&&b.remove();return}
if(b||!document.body)return;b=document.createElement("div");b.id="off36";b.setAttribute("role","status");b.textContent="أنت بدون إنترنت — بياناتك محفوظة وهتتزامن لما يرجع";b.style.cssText="position:fixed;top:0;left:0;right:0;z-index:99999;background:#7a5a00;color:#fff;font:600 12px sans-serif;text-align:center;padding:4px";document.body.appendChild(b)}
addEventListener("online",bn);addEventListener("offline",bn);addEventListener("DOMContentLoaded",bn);
})();
