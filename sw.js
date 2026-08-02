// Service worker do Caloricio.
//
// Existe porque o app é usado na academia, onde o sinal costuma ser ruim, e
// porque cada fantasia é uma imagem que não muda nunca depois de publicada.
//
// A armadilha clássica de service worker é deixar uma versão velha presa em
// cache. Aqui: o shell (html/css/js) usa rede-primeiro, então uma publicação
// nova aparece assim que houver rede e o cache só entra quando ela falta; as
// imagens usam cache-primeiro, porque o nome do arquivo já identifica a arte e
// ela nunca muda de conteúdo.

const VERSAO = 'v1';
const CACHE_SHELL = `caloricio-shell-${VERSAO}`;
const CACHE_ARTE = `caloricio-arte-${VERSAO}`;

const SHELL = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './calc.js',
  './mascote.js',
  './seletor.js',
  './preferencias.js',
  './cartao.js',
  './manifest.webmanifest',
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_SHELL)
      // addAll é tudo-ou-nada: se um arquivo falhar, a instalação inteira
      // falha e o service worker antigo continua no ar, que é o certo.
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) =>
        Promise.all(
          nomes
            .filter((n) => n.startsWith('caloricio-') && n !== CACHE_SHELL && n !== CACHE_ARTE)
            .map((n) => caches.delete(n))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const req = evento.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Só cuida do próprio site. A fonte do Google fica com o cache do navegador:
  // guardá-la aqui exigiria lidar com resposta opaca, que ocupa espaço sem dar
  // como verificar se deu certo.
  if (url.origin !== self.location.origin) return;

  // Arte: cache-primeiro. O nome do arquivo identifica a fantasia e o conteúdo
  // nunca muda, então servir do cache é sempre correto e instantâneo.
  if (url.pathname.includes('/img/')) {
    evento.respondWith(
      caches.match(req).then((cacheado) => {
        if (cacheado) return cacheado;
        return fetch(req)
          .then((resp) => {
            if (resp.ok) {
              const copia = resp.clone();
              caches.open(CACHE_ARTE).then((c) => c.put(req, copia));
            }
            return resp;
          })
          .catch(() =>
            // Sem rede e sem essa fantasia em cache: devolve a arte genérica em
            // vez de deixar a imagem quebrada. Acontece quando a pessoa fica
            // offline e escolhe um exercício que ainda não tinha visto.
            caches
              .match(`${url.origin}${url.pathname.replace(/caloricio-.*$/, '')}caloricio-gpt-normal.webp`)
              .then(
                (generico) =>
                  generico ||
                  new Response('', { status: 504, statusText: 'sem rede e sem cache' })
              )
          );
      })
    );
    return;
  }

  // Shell: rede-primeiro, cache como rede de segurança. Assim uma publicação
  // nova chega sozinha e o offline continua funcionando.
  evento.respondWith(
    fetch(req)
      .then((resp) => {
        if (resp.ok) {
          const copia = resp.clone();
          caches.open(CACHE_SHELL).then((c) => c.put(req, copia));
        }
        return resp;
      })
      .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
  );
});
