// Service Worker for Yjs PWA Demo
const CACHE_NAME = 'yjs-pwa-demo-v1';
const STATIC_CACHE = 'yjs-static-v1';
const DYNAMIC_CACHE = 'yjs-dynamic-v1';

// Core files to cache immediately
const coreAssets = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json'
];

// External CDN resources (cache with different strategy)
const cdnAssets = [
  'https://cdn.quilljs.com/1.3.6/quill.snow.css',
  'https://cdn.quilljs.com/1.3.6/quill.min.js',
  'https://unpkg.com/yjs@13.6.8/dist/y.js',
  'https://unpkg.com/y-quill@0.1.5/dist/y-quill.js',
  'https://unpkg.com/y-websocket@1.5.0/dist/y-websocket.js',
  'https://unpkg.com/y-protocols@1.0.6/dist/y-protocols.js'
];

// Install event - cache only core resources (avoid CORS issues)
self.addEventListener('install', event => {
  console.log('Yjs PWA: Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Yjs PWA: Caching core assets');
        return cache.addAll(coreAssets);
      })
      .then(() => {
        console.log('Yjs PWA: Installation complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Yjs PWA: Installation failed:', err);
        // Continue installation even if caching fails
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Yjs PWA: Service Worker activating...');

  const expectedCaches = [STATIC_CACHE, DYNAMIC_CACHE];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!expectedCaches.includes(cacheName)) {
            console.log('Yjs PWA: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Yjs PWA: Taking control of clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-HTTP requests
  if (!request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests with different strategies
  if (coreAssets.some(asset => request.url.endsWith(asset))) {
    // Core assets: Cache first, network fallback
    event.respondWith(handleCoreAssets(request));
  } else if (cdnAssets.includes(request.url)) {
    // CDN assets: Cache first, network fallback
    event.respondWith(handleCDNAssets(request));
  } else if (request.url.includes('demos.yjs.dev') || request.url.includes('ws://') || request.url.includes('wss://')) {
    // WebSocket and collaboration server: Network only
    event.respondWith(fetch(request));
  } else if (request.destination === 'document') {
    // HTML documents: Network first, cache fallback
    event.respondWith(handleDocuments(request));
  } else {
    // Everything else: Network first, cache fallback
    event.respondWith(handleOtherRequests(request));
  }
});

// Cache first strategy for core assets
async function handleCoreAssets(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Failed to fetch core asset:', request.url, error);

    // Return cached version or offline fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return minimal offline HTML for document requests
    if (request.destination === 'document') {
      return new Response(getOfflineHTML(), {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    throw error;
  }
}

// Network first strategy for CDN assets (avoid CORS caching issues)
async function handleCDNAssets(request) {
  try {
    // Always try network first for CDN resources
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Only cache if the response allows it (has proper CORS headers)
      const contentType = networkResponse.headers.get('content-type');
      if (contentType && (contentType.includes('javascript') || contentType.includes('css'))) {
        try {
          const cache = await caches.open(DYNAMIC_CACHE);
          cache.put(request, networkResponse.clone());
        } catch (cacheError) {
          console.warn('Could not cache CDN asset (CORS):', request.url);
        }
      }
    }
    return networkResponse;
  } catch (error) {
    console.warn('Network failed for CDN asset:', request.url, error);

    // Fallback to cache if available
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // If it's a JavaScript library, return a minimal fallback that won't break the app
    if (request.url.includes('.js')) {
      return new Response('// CDN resource unavailable - using fallback', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }

    throw error;
  }
}

// Network first strategy for documents
async function handleDocuments(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.warn('Network failed for document:', request.url, error);
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return new Response(getOfflineHTML(), {
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Network first strategy for other requests
async function handleOtherRequests(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Generate offline HTML page
function getOfflineHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Yjs PWA Demo - Offline</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #2196F3, #1976D2);
          color: white;
          margin: 0;
          padding: 2rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }
        .container {
          max-width: 500px;
          background: rgba(255, 255, 255, 0.1);
          padding: 3rem;
          border-radius: 1rem;
          backdrop-filter: blur(10px);
        }
        h1 { font-size: 2.5rem; margin-bottom: 1rem; }
        p { font-size: 1.2rem; line-height: 1.6; margin-bottom: 2rem; }
        .icon { font-size: 4rem; margin-bottom: 2rem; }
        .retry-btn {
          background: white;
          color: #2196F3;
          border: none;
          padding: 1rem 2rem;
          border-radius: 0.5rem;
          font-size: 1rem;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .retry-btn:hover { transform: translateY(-2px); }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="icon">📱</div>
        <h1>You're Offline</h1>
        <p>The Yjs PWA Demo works offline once cached. Please connect to the internet and refresh to load the full application.</p>
        <button class="retry-btn" onclick="window.location.reload()">
          🔄 Try Again
        </button>
      </div>
    </body>
    </html>
  `;
}

// Background sync for Yjs collaboration data
self.addEventListener('sync', event => {
  console.log('Yjs PWA: Background sync triggered for:', event.tag);

  if (event.tag === 'yjs-data-sync') {
    event.waitUntil(syncYjsData());
  }
});

// Sync Yjs data when back online
async function syncYjsData() {
  try {
    console.log('Yjs PWA: Syncing collaboration data...');

    // Get stored Yjs updates from IndexedDB or localStorage
    const storedUpdates = localStorage.getItem('yjs-pending-updates');
    if (storedUpdates) {
      // Send updates to collaboration server
      // This would be implemented with your specific sync logic
      console.log('Yjs PWA: Found pending updates to sync');
      localStorage.removeItem('yjs-pending-updates');
    }
  } catch (error) {
    console.error('Yjs PWA: Failed to sync data:', error);
  }
}

// Handle push notifications for collaboration updates
self.addEventListener('push', event => {
  console.log('Yjs PWA: Push notification received');

  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.message || 'New collaboration update available',
    icon: data.icon || '/manifest.json',
    badge: '/manifest.json',
    vibrate: [200, 100, 200],
    data: {
      url: data.url || '/',
      timestamp: Date.now()
    },
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: true,
    tag: 'yjs-collaboration'
  };

  event.waitUntil(
    self.registration.showNotification('Yjs Collaboration Update', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('Yjs PWA: Notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then(clients => {
        // Check if app is already open
        for (const client of clients) {
          if (client.url.includes(self.registration.scope) && 'focus' in client) {
            return client.focus();
          }
        }

        // Open new window
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }

  // Dismiss action requires no additional handling
});
