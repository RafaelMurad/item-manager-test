// components/MswWorker.tsx
'use client';

import { useEffect } from 'react';

export default function MswWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development' || typeof window === 'undefined') {
      return;
    }

    (async () => {
      try {
        const { setupWorker } = await import('msw/browser');
        const { handlers } = await import('../mocks/handlers');
        const worker = setupWorker(...handlers);
        await worker.start({ onUnhandledRequest: 'bypass' });
        console.log('[MSW] Mocking enabled.');
      } catch (err) {
        console.error('[MSW] Failed to initialize:', err);
      }
    })();
  }, []);

  return null;
}
