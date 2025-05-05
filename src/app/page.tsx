'use client';

import Image from "next/image";

export default function Home() {
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Items</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      </div>
    </div>
  );
}
