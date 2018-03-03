importScripts('/node_modules/workbox-sw/build/importScripts/workbox-sw.prod.v2.1.2.js');

const workbox = new WorkboxSW({
    skipWaiting: true,
    clientsClaim: true
});

self.addEventListener('push', (event) => {
    const title = 'Get Started With Workbox';
    const options = {
        body: event.data.text()
    };
    event.waitUntil(self.registration.showNotification(title, options));
});


workbox.precache([
  {
    "url": "index.html",
    "revision": "fbd0b7cf85ab17c5074927efaffea0e4"
  },
  {
    "url": "index.js",
    "revision": "b6de1f7e2a0fafdc865e5b25c159a654"
  }
]);