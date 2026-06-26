"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl mb-6 opacity-20">⚠️</p>
      <h2 className="text-4xl font-black text-white mb-3">Something went wrong</h2>
      <p className="text-gray-500 mb-8">An unexpected error occurred. Please try again.</p>
      <div className="flex gap-4">
        <button
          onClick={reset}
          className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-[#1e2a4a] text-gray-300 hover:text-white px-8 py-3 rounded-2xl font-semibold transition"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
