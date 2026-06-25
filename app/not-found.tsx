import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="text-8xl mb-6 opacity-20">🥋</p>
      <h1 className="text-5xl font-black text-white mb-3">404</h1>
      <p className="text-gray-500 mb-8">This page tapped out. It doesn&apos;t exist.</p>
      <Link
        href="/"
        className="bg-blue-700 hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition"
      >
        Back to the mat
      </Link>
    </div>
  );
}
