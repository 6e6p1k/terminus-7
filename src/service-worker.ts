/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

const sw = self as unknown as ServiceWorkerGlobalScope;

const CACHE = `tm7-cache-${version}`;
const ASSETS = [...build, ...files];

function isApiRequest(url: URL) {
	return url.pathname.startsWith('/api/');
}

sw.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => sw.skipWaiting())
	);
});

sw.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== CACHE) await caches.delete(key);
			}
			await sw.clients.claim();
		})
	);
});

sw.addEventListener('fetch', (event) => {
	if (event.request.method !== 'GET') return;

	const url = new URL(event.request.url);

	// Never cache chat / API traffic (streaming + auth-sensitive).
	if (isApiRequest(url)) return;

	// Only handle same-origin requests.
	if (url.origin !== sw.location.origin) return;

	// Precached build/static assets: cache-first.
	if (ASSETS.includes(url.pathname)) {
		event.respondWith(
			caches.match(event.request).then((cached) => cached || fetch(event.request))
		);
		return;
	}

	// Navigations / other same-origin GETs: network-first, cache fallback.
	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE);
			try {
				const response = await fetch(event.request);
				if (!(response instanceof Response)) {
					throw new Error('invalid response from fetch');
				}
				if (response.status === 200 && !response.headers.get('cache-control')?.includes('no-store')) {
					cache.put(event.request, response.clone());
				}
				return response;
			} catch (err) {
				const cached = await cache.match(event.request);
				if (cached) return cached;

				// Shell fallback for navigations when offline.
				if (event.request.mode === 'navigate') {
					const shell = await cache.match('/');
					if (shell) return shell;
				}
				throw err;
			}
		})()
	);
});
