"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "Sign-in is not configured correctly. The site owner needs to set AUTH_SECRET, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET in Vercel.",
  AccessDenied: "Access was denied. You may not have permission to sign in.",
  Verification: "The sign-in link is no longer valid. Please try again.",
  OAuthSignin: "Could not start Google sign-in. Check that Google OAuth credentials are configured.",
  OAuthCallback: "Google sign-in failed. Make sure the redirect URI is added in Google Cloud Console.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Use the same provider you signed up with.",
  Default: "Something went wrong during sign-in. Please try again.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error
    ? AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.Default
    : null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] py-12 px-4">
      <div className="max-w-md w-full">
        <div className="belt-gradient h-0.5 w-full rounded-full mb-10 opacity-60" />

        <div className="bg-[#111] border border-[#1e2a4a] rounded-3xl p-10 shadow-2xl shadow-blue-950/30">
          <div className="text-center mb-10">
            <div className="text-5xl mb-4">🥋</div>
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome to GiSwap</h1>
            <p className="text-gray-500 mt-2 text-sm">Sign in to buy, sell, and connect with grapplers.</p>
          </div>

          {errorMessage && (
            <div
              role="alert"
              className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200"
            >
              {errorMessage}
            </div>
          )}

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-3 py-4 bg-[#0d0d0d] border border-[#2a3a5a] hover:border-blue-600 rounded-2xl transition text-white font-medium group"
          >
            <Image
              src="https://www.google.com/favicon.ico"
              width={20}
              height={20}
              className="w-5 h-5"
              alt="Google"
              unoptimized
            />
            <span className="group-hover:text-blue-300 transition">Continue with Google</span>
          </button>

          <div className="mt-8 text-center">
            <div className="flex items-center gap-3 justify-center">
              <div className="w-6 h-0.5 bg-white rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-blue-600 rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-purple-600 rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-amber-700 rounded-full opacity-80" />
              <div className="w-6 h-0.5 bg-[#222] rounded-full border border-zinc-700" />
            </div>
            <p className="text-xs text-gray-600 mt-4">Used only for authentication. No spam. Oss.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
