'use client';

import { useEffect } from 'react';
import data from '../mocks/data.json';

export default function Home() {
  useEffect(() => {
    console.log('All Items from data.json:', data.items);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Item Manager Test</h1>
      <p>Check the browser console to see the items data</p>
    </main>
  );
}
