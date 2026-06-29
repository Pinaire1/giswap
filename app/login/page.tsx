"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="page-accent w-full mb-8 sm:mb-10" />

        <div className="card p-8 sm:p-10 shadow-2xl shadow-blue-950/30">
          <div className="text-center mb-8 sm:mb-10">
            <div className="text-5xl mb-4" aria-hidden="true">🥋</div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Welcome to GiSwap</h1>
            <p className="text-gray-500 mt-2 text-sm leading-relaxed">
              Sign in to buy, sell, and connect with grapplers.
            </p>
          </div>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 min-h-[52px] bg-[#0d0d0d] border border-[#2a3a5a] hover:border-blue-600 rounded-2xl transition text-white font-medium group"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              width={20}
              height={20}
              className="w-5 h-5"
              alt=""
              unoptimized
            />
            <span className="group-hover:text-blue-300 transition">Continue with Google</span>
          </button>

          <div className="mt-8 text-center">
            <div className="flex items-center gap-3 justify-center" aria-hidden="true">
              <div className="w-6 h-0.5 bg-white rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-blue-600 rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-purple-600 rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-amber-700 rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-[#222] rounded-full border border-zinc-700" />
            </div>
            <p className="text-xs text-gray-600 mt-4 leading-relaxed">
              Used only for authentication. No spam. Oss.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
