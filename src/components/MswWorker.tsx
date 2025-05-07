'use client';

import { useEffect, useState, createContext, useContext } from 'react';

export const MswContext = createContext<{
  isMswReady: boolean;
}>({
  isMswReady: false,
});

export const useMsw = () => useContext(MswContext);

export default function MswWorker({ children }: { children?: React.ReactNode }) {
  const [isMswReady, setIsMswReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (process.env.NODE_ENV !== 'development') return;

    const enableMocking = async () => {
      try {
        const { worker } = await import('@/mocks/browser');
        await worker.start({
          onUnhandledRequest: 'bypass',
          serviceWorker: {
            url: '/mockServiceWorker.js',
          },
        });
        console.log('[MSW] Mock service worker started successfully!');
        setIsMswReady(true);
      } catch (error) {
        console.error('[MSW] Failed to initialize MSW:', error);
      }
    };

    enableMocking();
  }, []);

  return (
    <MswContext.Provider value={{ isMswReady }}>
      {children}
    </MswContext.Provider>
  );
}
