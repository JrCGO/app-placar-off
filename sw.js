// Service Worker para App Placar PWA - Otimizado para Offline
const CACHE_NAME = 'placar-app-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    '/icon.svg'
];

// Instalação do Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Cache aberto');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('Service Worker: Recursos em cache');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.error('Service Worker: Erro ao instalar', error);
            })
    );
});

// Ativação do Service Worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Ativando...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('Service Worker: Ativado');
            return self.clients.claim();
        })
    );
});

// Interceptação de requisições - Estratégia Cache First para funcionamento offline
self.addEventListener('fetch', function(event) {
    console.log('Service Worker: Interceptando requisição para:', event.request.url);
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache First - Retorna do cache se disponível
                if (response) {
                    console.log('Service Worker: Servindo do cache (offline):', event.request.url);
                    return response;
                }
                
                // Se não estiver no cache, tenta buscar da rede
                return fetch(event.request)
                    .then(function(response) {
                        // Verifica se a resposta é válida
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        
                        // Adiciona ao cache para uso offline futuro
                        var responseToCache = response.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                                console.log('Service Worker: Adicionado ao cache para offline:', event.request.url);
                            });
                        
                        return response;
                    })
                    .catch(function(error) {
                        console.log('Service Worker: Rede indisponível, funcionando offline:', error);
                        
                        // Estratégia offline robusta
                        if (event.request.destination === 'document') {
                            return caches.match('/index.html');
                        }
                        
                        // Para recursos específicos, tenta alternativas
                        if (event.request.url.includes('.css')) {
                            return caches.match('/styles.css');
                        }
                        if (event.request.url.includes('.js')) {
                            return caches.match('/app.js');
                        }
                        
                        // Fallback para qualquer recurso
                        return new Response('', {
                            status: 200,
                            statusText: 'OK',
                            headers: {
                                'Content-Type': 'text/html'
                            }
                        });
                    });
            })
    );
});

// Mensagens do Service Worker
self.addEventListener('message', function(event) {
    console.log('Service Worker: Mensagem recebida:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({
            version: CACHE_NAME
        });
    }
});

// Sincronização em background (quando voltar online)
self.addEventListener('sync', function(event) {
    console.log('Service Worker: Sincronização em background');
    
    if (event.tag === 'background-sync') {
        event.waitUntil(
            // Aqui você pode implementar lógica de sincronização
            // Por exemplo, enviar dados salvos offline para o servidor
            doBackgroundSync()
        );
    }
});

function doBackgroundSync() {
    return new Promise(function(resolve) {
        console.log('Service Worker: Executando sincronização...');
        // Implementar lógica de sincronização aqui
        resolve();
    });
}

// Notificações push (opcional)
self.addEventListener('push', function(event) {
    console.log('Service Worker: Notificação push recebida');
    
    const options = {
        body: event.data ? event.data.text() : 'Nova atualização do placar!',
        icon: '/icon.svg',
        badge: '/icon.svg',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Abrir App',
                icon: '/icon.svg'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icon.svg'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('App Placar', options)
    );
});

// Clique em notificação
self.addEventListener('notificationclick', function(event) {
    console.log('Service Worker: Clique na notificação');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Notificação fechada
self.addEventListener('notificationclose', function(event) {
    console.log('Service Worker: Notificação fechada');
});

// Erro no Service Worker
self.addEventListener('error', function(event) {
    console.error('Service Worker: Erro:', event.error);
});

// Service Worker não controlado
self.addEventListener('unhandledrejection', function(event) {
    console.error('Service Worker: Promise rejeitada:', event.reason);
});
