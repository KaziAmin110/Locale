import React from "react";

interface SwipeControlsProps {
  onPass: () => void;
  onLike: () => void;
  disabled?: boolean; // Accept the disabled prop
}

export default function SwipeControls({
  onPass,
  onLike,
  disabled = false,
}: SwipeControlsProps) {
  return (
    <div className="flex justify-center mt-12 space-x-12">
      <button
        onClick={onPass}
        disabled={disabled} // Apply the disabled attribute
        className="flex items-center justify-center w-16 h-16 transition-all duration-200 bg-white border-2 border-red-200 rounded-full shadow-lg hover:bg-red-50 hover:border-red-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Pass"
      >
        <svg
          className="w-8 h-8 text-red-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <button
        onClick={onLike}
        disabled={disabled} // Apply the disabled attribute
        className="flex items-center justify-center w-16 h-16 transition-all duration-200 bg-white border-2 border-green-200 rounded-full shadow-lg hover:bg-green-50 hover:border-green-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        aria-label="Like"
      >
        <svg
          className="w-8 h-8 text-green-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </div>
  );
}
