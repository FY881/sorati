/* a11y36: WCAG helpers — focus ring, aria-labels for icon buttons, reduced motion, dialog roles */
(function(){try{
var s=document.createElement('style');s.id='a11y36css';
s.textContent=':focus-visible{outline:3px solid #f5c542!important;outline-offset:2px!important}@media(prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}button,[role=button],a{min-height:24px;min-width:24px}';
(document.head||document.documentElement).appendChild(s);
function fix(r){(r||document).querySelectorAll('button,[role=button],[onclick]').forEach(function(b){
if(b.getAttribute('aria-label'))return;var t=(b.textContent||'').trim();
if(!t){var tt=b.getAttribute('title')||b.getAttribute('data-t');if(tt)b.setAttribute('aria-label',tt);}
if(b.tagName!=='BUTTON'&&!b.hasAttribute('role')&&b.hasAttribute('onclick')){b.setAttribute('role','button');if(!b.hasAttribute('tabindex'))b.tabIndex=0;}});
(r||document).querySelectorAll('.modal,.sheet,[class*=sheet]').forEach(function(m){if(!m.getAttribute('role')){m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');}});
(r||document).querySelectorAll('img:not([alt])').forEach(function(i){i.setAttribute('alt','')});}
document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target&&e.target.getAttribute&&e.target.getAttribute('role')==='button'&&e.target.tagName!=='BUTTON'){e.preventDefault();e.target.click();}});
var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(fix,300)}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('DOMContentLoaded',function(){fix()});
}catch(e){}})();
