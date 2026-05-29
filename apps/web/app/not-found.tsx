import Link from "next/link";
import { Home, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-12">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <span className="text-lg font-semibold">Launchpad</span>
        </div>

        {/* 404 */}
        <p className="text-8xl font-black text-blue-500 leading-none mb-4">404</p>

        <h1 className="text-2xl font-bold mb-3">Page not found</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-10">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
