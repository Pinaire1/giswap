import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 text-center">
      <EmptyState
        icon="🥋"
        title="404 — This page tapped out"
        description="The page you're looking for doesn't exist or has been removed."
        action={{ href: "/", label: "Back to the mat" }}
      />
      <Link href="/listings" className="mt-4 text-sm text-blue-400 hover:text-blue-300 transition">
        Browse gis instead →
      </Link>
    </div>
  );
}
