"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

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
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white font-sans antialiased">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-10">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <span className="text-lg font-semibold">Launchpad</span>
            </div>

            {/* Error icon */}
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>

            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              We encountered an unexpected error. Our team has been notified. You
              can try refreshing the page or head back to the dashboard.
            </p>

            {error.digest && (
              <p className="text-xs text-white/20 font-mono mb-6">
                Error ID: {error.digest}
              </p>
            )}

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={reset}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try again
              </button>
              <Link
                href="/dashboard"
                className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
