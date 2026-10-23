/* Service worker : précache de l'application, fonctionnement hors ligne (cache d'abord).
   Aucune donnée de patrouille n'est mise en cache : elles restent chiffrées dans le stockage local. */
const VERSION="fp-cpl3-v1";
const FILES=["./","index.html","manifest.webmanifest","vendor/jspdf.umd.min.js","vendor/jspdf.plugin.autotable.min.js","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{const r=e.request;if(r.method!=="GET"||new URL(r.url).origin!==location.origin)return;
 e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VERSION).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match("index.html"))))});
