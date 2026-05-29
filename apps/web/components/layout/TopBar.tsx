"use client";

import { Bell, Search, Menu, Loader2, X, Check, CheckCheck } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
}

interface Campaign {
  id: string;
  name: string;
  description?: string;
  status: string;
}

interface SearchResults {
  campaigns: Campaign[];
}

interface Notification {
  id: string;
  title: string;
  body: string | null;
  type: "info" | "success" | "warning" | "error";
  link: string | null;
  is_read: boolean;
  created_at: string;
}

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

const typeColor: Record<string, string> = {
  info: "bg-blue-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
};

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetch("/api/notifications?unread=true")
      .then((r) => r.json())
      .then((data) => {
        if (data.data) setNotifications(data.data);
        if (typeof data.unreadCount === "number") setUnreadCount(data.unreadCount);
      })
      .catch(() => {});
  }, []);

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAllRead = useCallback(async () => {
    setNotifLoading(true);
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch {
      // ignore
    } finally {
      setNotifLoading(false);
    }
  }, []);

  const handleNotificationClick = useCallback(
    async (notif: Notification) => {
      if (!notif.is_read) {
        // Mark as read
        fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [notif.id] }),
        }).catch(() => {});
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      }
      setShowNotifications(false);
      if (notif.link) {
        router.push(notif.link);
      }
    },
    [router]
  );

  // Fetch results when debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data: SearchResults) => {
        if (!cancelled) {
          setResults(data);
          setShowDropdown(true);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setSearchFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
        setQuery("");
        inputRef.current?.blur();
      }
    },
    []
  );

  const handleSelect = (href: string) => {
    setShowDropdown(false);
    setQuery("");
    router.push(href);
  };

  const hasResults =
    results && results.campaigns.length > 0;
  const isEmpty =
    results && results.campaigns.length === 0;

  return (
    <header className="h-16 border-b border-white/5 bg-[#0a0a0a]/80 backdrop-blur-xl flex items-center justify-between px-6 gap-4">
      <div className="flex items-center gap-4">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div ref={containerRef} className="relative">
          <div
            className={cn(
              "flex items-center gap-2 bg-[#1a1a1a] border rounded-xl px-3 py-2 transition-all duration-200",
              searchFocused ? "border-blue-500/50 w-64" : "border-white/10 w-48"
            )}
          >
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 text-white/30 flex-shrink-0 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5 text-white/30 flex-shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                setSearchFocused(true);
                if (results) setShowDropdown(true);
              }}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-sm text-white placeholder:text-white/20 focus:outline-none w-full"
            />
            {query ? (
              <button
                onClick={() => {
                  setQuery("");
                  setShowDropdown(false);
                  inputRef.current?.focus();
                }}
                className="text-white/20 hover:text-white/50 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            ) : (
              <kbd className="text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded border border-white/10 font-mono hidden sm:block">
                ⌘K
              </kbd>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-[#111111] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
              {isEmpty && (
                <div className="px-4 py-6 text-center text-sm text-white/40">
                  No results for &ldquo;{query}&rdquo;
                </div>
              )}

              {hasResults && (
                <div>
                  {results!.campaigns.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-[10px] uppercase tracking-wider text-white/30 font-medium border-b border-white/5">
                        Campaigns
                      </div>
                      {results!.campaigns.map((campaign) => (
                        <button
                          key={campaign.id}
                          onClick={() =>
                            handleSelect(`/dashboard/campaigns/${campaign.id}`)
                          }
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                        >
                          <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <Search className="w-3 h-3 text-blue-400" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm text-white truncate">
                              {campaign.name}
                            </p>
                            {campaign.description && (
                              <p className="text-xs text-white/30 truncate">
                                {campaign.description}
                              </p>
                            )}
                          </div>
                          <span className="ml-auto text-[10px] text-white/20 bg-white/5 px-1.5 py-0.5 rounded flex-shrink-0">
                            {campaign.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-[#1a1a1a] border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-all"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-[#111111] border border-white/10 rounded-xl shadow-xl z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-sm font-semibold text-white">Notifications</span>
                <button
                  onClick={handleMarkAllRead}
                  disabled={notifLoading || unreadCount === 0}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-white/30">
                    <Check className="w-6 h-6" />
                    <span className="text-sm">You&apos;re all caught up</span>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <button
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-0",
                        !notif.is_read && "bg-white/[0.02]"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-1.5 w-2 h-2 rounded-full flex-shrink-0",
                          typeColor[notif.type] ?? "bg-blue-500",
                          notif.is_read && "opacity-30"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <p className={cn("text-sm truncate", notif.is_read ? "text-white/50" : "text-white font-medium")}>
                          {notif.title}
                        </p>
                        {notif.body && (
                          <p className="text-xs text-white/30 line-clamp-2 mt-0.5">
                            {notif.body}
                          </p>
                        )}
                        <p className="text-[10px] text-white/20 mt-1">
                          {timeAgo(notif.created_at)}
                        </p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
