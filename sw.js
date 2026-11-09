// Jarvis: guarda o app no aparelho para abrir mesmo sem o Mac por perto.
// Rede primeiro (pega a versão nova quando o Mac está acessível), cache como reserva.
const CACHE = 'jarvis-v4';
const FILES = ['./', './index.html', './icon-180.png', './icon-512.png', './manifest.json', './supabase.min.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== 'GET' || u.pathname.startsWith('/api/')) return;
  e.respondWith(
    fetch(e.request, {cache: 'no-store'}).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('./index.html')))
  );
});
