"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

// --- Self-contained Icon Components for consistency ---
const DiscoverIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const MatchesIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

const MessagesIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const ProfileIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

export default function BottomNavigation() {
  const navItems = [
    { id: "swipe", label: "Discover", Icon: DiscoverIcon, path: "/swipe" },
    { id: "matches", label: "Matches", Icon: MatchesIcon, path: "/matches" },
    { id: "chat", label: "Messages", Icon: MessagesIcon, path: "/chat" },
    { id: "profile", label: "Profile", Icon: ProfileIcon, path: "/profile" },
  ];

  const currentPath = usePathname();

  return (
    <div className="fixed bottom-4 left-1/2 z-50 h-16 w-[95%] max-w-sm -translate-x-1/2 rounded-full border border-gray-200/50 bg-white/80 shadow-2xl backdrop-blur-lg">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;

          return (
            <Link
              href={item.path}
              key={item.id}
              className={`flex h-12 flex-grow items-center justify-center gap-2 rounded-full px-4 text-sm font-medium transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-primary text-white shadow-inner"
                    : "text-gray-500 hover:text-primary"
                }`}
            >
              <item.Icon className="w-6 h-6" />
              <span className={isActive ? "inline" : "hidden"}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
