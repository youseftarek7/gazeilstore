import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import App from './App.tsx';
import './index.css';

// Detect in-app browsers (Facebook, Instagram, Messenger)
const isFbOrIg = typeof navigator !== 'undefined' && /FB_IAB|FBAN|FBAV|Instagram|FB4A|Line/i.test(navigator.userAgent || '');

if (isFbOrIg) {
  // In Facebook & Instagram in-app WebViews, aggressive Service Worker caching causes
  // customers to see stale bundles and broken/duplicate images indefinitely.
  // We unregister any active Service Worker and clear CacheStorage so in-app views always load fresh.
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const r of registrations) {
        r.unregister();
      }
    });
  }
  if ('caches' in window) {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    });
  }
} else {
  // Automatically register and update Service Worker when new builds/deploys are available
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true);
    },
    onRegisteredSW(_swUrl, registration) {
      if (registration) {
        // Check for updates when user refocuses the app/tab
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState === 'visible' && navigator.onLine) {
            registration.update();
          }
        });
        // Check periodically for updates every 15 minutes
        setInterval(() => {
          if (navigator.onLine) {
            registration.update();
          }
        }, 15 * 60 * 1000);
      }
    },
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
);
