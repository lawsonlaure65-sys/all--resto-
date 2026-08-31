import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { TranslationProvider } from './context/TranslationContext';
import { applyOfficialBrandFavicon } from './utils/faviconManager';
import './index.css';

// Immediately apply brand favicon and title
applyOfficialBrandFavicon();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TranslationProvider>
      <App />
    </TranslationProvider>
  </StrictMode>,
);
