"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  Configuration:
    "Sign-in is not configured correctly. Check AUTH_SECRET and Google OAuth credentials in Vercel.",
  AccessDenied: "Access was denied. You may not have permission to sign in.",
  Verification: "The sign-in link is no longer valid. Please try again.",
  OAuthSignin: "Could not start Google sign-in. Check that Google OAuth credentials are configured.",
  OAuthCallback:
    "Google sign-in failed. If you are on a preview deploy, sign in from https://giswap.vercel.app instead, or configure AUTH_REDIRECT_PROXY_URL.",
  OAuthAccountNotLinked:
    "This email is already linked to another sign-in method. Use the same provider you signed up with.",
  Default:
    "Sign-in failed, usually because the OAuth cookie was lost between redirects. Sign in from https://giswap.vercel.app (not a preview URL), then try again.",
};

function LoginErrorBanner() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = error
    ? AUTH_ERROR_MESSAGES[error] ?? AUTH_ERROR_MESSAGES.Default
    : null;

  if (!errorMessage) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl border border-red-900/60 bg-red-950/30 px-4 py-3 text-sm text-red-200"
    >
      {errorMessage}
    </div>
  );
}

export default function LoginError() {
  return (
    <Suspense>
      <LoginErrorBanner />
    </Suspense>
  );
}
