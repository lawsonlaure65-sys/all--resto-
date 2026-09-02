import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TranslationProvider } from './context/TranslationContext';
import { applyOfficialBrandFavicon } from './utils/faviconManager';
import './index.css';

// Handle benign sandbox environment warnings & WebSocket HMR events cleanly
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    if (
      event.reason?.message?.includes('WebSocket') ||
      event.reason?.message?.includes('vite') ||
      String(event.reason).includes('WebSocket')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('WebSocket') ||
      event.message?.includes('[vite]') ||
      event.filename?.includes('vite')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

// Immediately apply brand favicon and title
applyOfficialBrandFavicon();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TranslationProvider>
      <App />
    </TranslationProvider>
  </StrictMode>,
);

