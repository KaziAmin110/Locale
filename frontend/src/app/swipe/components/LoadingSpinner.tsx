import React from "react";

export default function LoadingSpinner() {
  return (
    // --- NEW: White card container ---
    <div className="p-10 bg-white border border-gray-100 shadow-xl rounded-3xl">
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary animate-pulse"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
        </div>

        <p className="mt-4 font-medium text-gray-600">
          Finding perfect matches...
        </p>

        <div className="flex mt-2 space-x-1">
          <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0.1s" }}
          ></div>
          <div
            className="w-2 h-2 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
        </div>
      </div>
    </div>
  );
}
