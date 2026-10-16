const CACHE_NAME = 'aza-mobile-pwa-v20';
const APP_SHELL = ['./', './index.html', './manifest.json', './icons/aza-192.png', './icons/aza-512.png', './icons/products/bag.webp', './icons/products/shoes.webp', './icons/products/tshirt.webp', './icons/products/shorts.webp', './icons/products/undershirt.webp', './icons/products/perfume.webp', './icons/products/watch.webp', './icons/products/socks.webp', './icons/products/shirt.webp', './icons/products/suit.webp', './icons/products/hoodie.webp', './icons/products/blazer.webp', './icons/products/pants.webp', './icons/products/ring.webp', './icons/products/belt.webp', './icons/products/button.webp'];
self.addEventListener('install', event => {
  event.waitUntil((async()=>{const cache=await caches.open(CACHE_NAME);await cache.addAll(APP_SHELL);await self.skipWaiting()})());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(k=>k.startsWith('aza-mobile-pwa-')&&k!==CACHE_NAME).map(k=>caches.delete(k)));await self.clients.claim()})());
});
self.addEventListener('fetch', event => {
  const req=event.request;const url=new URL(req.url);
  if(req.method!=='GET'||url.origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith((async()=>{try{const fresh=await fetch(req,{cache:'no-cache'});if(fresh&&fresh.ok){const cache=await caches.open(CACHE_NAME);cache.put('./index.html',fresh.clone()).catch(()=>{});return fresh}}catch(e){}return (await caches.match(req))||(await caches.match('./index.html'))})());
    return;
  }
  event.respondWith((async()=>{const cached=await caches.match(req);if(cached)return cached;try{const fresh=await fetch(req);if(fresh&&fresh.ok){const cache=await caches.open(CACHE_NAME);cache.put(req,fresh.clone()).catch(()=>{})}return fresh}catch(e){return cached||Response.error()}})());
});
