"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full bg-white p-10 rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Welcome to GiSwap</h1>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-3 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition text-lg font-medium"
        >
          <img 
            src="https://www.google.com/favicon.ico" 
            className="w-6 h-6" 
            alt="Google" 
          />
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-500 mt-8">
          We'll only use this for authentication
        </p>
      </div>
    </div>
  );
}