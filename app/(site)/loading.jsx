// app/loading.jsx
'use client';
import { useEffect, useState } from 'react';

export default function GlobalLoading() {
  const [hide, setHide] = useState(false);

  // When the component is about to unmount, start a 150 ms fade-out.
  useEffect(() => {
    return () => setHide(true);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[9999] grid place-content-center
                  bg-black/60 backdrop-blur-sm transition-opacity
                  ${hide ? 'opacity-0' : 'opacity-100'}`}
    >
      <span className="h-10 w-10 animate-spin rounded-full border-4
                       border-red-600 border-t-transparent" />
    </div>
  );
}
