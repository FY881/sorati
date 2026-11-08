/* imgguard36: stops requests for unresolved template srcs (e.g. "${img}") and hides broken images */
(function(){var bad=function(s){return !s||/\$\{|\{\{|undefined|null$/.test(s)};
function fix(i){var s=i.getAttribute&&i.getAttribute('src');if(s!==null&&bad(s)){i.removeAttribute('src');i.style.visibility='hidden'}}
try{var d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');Object.defineProperty(HTMLImageElement.prototype,'src',{get:d.get,set:function(v){if(bad(String(v)))return;d.set.call(this,v)}})}catch(e){}
new MutationObserver(function(m){m.forEach(function(r){r.addedNodes.forEach(function(n){if(n.tagName==='IMG')fix(n);else if(n.querySelectorAll)n.querySelectorAll('img').forEach(fix)})})}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('error',function(e){if(e.target&&e.target.tagName==='IMG')e.target.style.visibility='hidden'},true)})();
;(function(){var re=/(<img\b[^>]*?\bsrc\s*=\s*)(["']?)([^"'>\s]*(?:\$\{|%7B|\{\{)[^"'>]*)\2/gi;function cl(h){return typeof h==='string'&&h.indexOf('<img')>-1?h.replace(re,'$1"" data-bad=$2x$2'):h}
try{var p=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML');Object.defineProperty(Element.prototype,'innerHTML',{get:p.get,set:function(v){p.set.call(this,cl(v))},configurable:true});
var o=Element.prototype.insertAdjacentHTML;Element.prototype.insertAdjacentHTML=function(a,h){return o.call(this,a,cl(h))}}catch(e){}})();
