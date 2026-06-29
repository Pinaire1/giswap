"use client";

import { useEffect } from "react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

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
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center">
      <EmptyState
        icon="⚠️"
        title="Something went wrong"
        description="An unexpected error occurred. Please try again or head back home."
      />
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <button onClick={reset} className="btn-primary px-8 py-3">
          Try again
        </button>
        <Link href="/" className="btn-outline px-8 py-3">
          Go home
        </Link>
      </div>
    </div>
  );
}
