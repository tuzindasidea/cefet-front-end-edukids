const CACHE_NAME = 'edukids-v2';
const ASSETS_ESTATICOS = [
  '/',
  '/index.html',
  '/basico.css',
  '/exercicio.css',
  '/jogo.js',
  '/favicon/manifest.json',
  '/favicon/android-icon-192x192.png',
  '/imgs/desconhecido.jpg',
  '/imgs/cachorro.jpg',
  '/imgs/coelho.jpg',
  '/imgs/gato.jpg',
  '/imgs/girafa.jpg',
  '/imgs/hipopotamo.jpg',
  '/imgs/leao.jpg',
  '/imgs/peixe.jpg',
  '/imgs/rato.jpg',
  '/imgs/urso.jpg',
  '/imgs/icone-comecar.png',
  '/imgs/icone-parar.png',
  '/sounds/success.wav',
  '/sounds/error.wav'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_ESTATICOS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
