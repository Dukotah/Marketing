"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function DashboardError({
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
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Error icon */}
        <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>

        <h1 className="text-2xl font-bold text-white mb-3">Something went wrong</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-6">
          An error occurred while loading this page. You can try again or go back to the dashboard.
        </p>

        {/* Error message */}
        {error.message && (
          <pre className="text-left text-xs text-white/30 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 mb-8 overflow-x-auto font-mono whitespace-pre-wrap break-all">
            {error.message}
          </pre>
        )}

        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
