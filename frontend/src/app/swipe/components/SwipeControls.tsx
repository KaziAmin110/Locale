import React from 'react';

interface SwipeControlsProps {
  onPass: () => void;
  onLike: () => void;
}

export default function SwipeControls({ onPass, onLike }: SwipeControlsProps) {
  return (
    <div className="flex justify-center space-x-8 mt-8">
      <button
        onClick={onPass}
        className="w-16 h-16 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center transition-colors"
      >
        <span className="text-red-600 text-2xl">✕</span>
      </button>
      <button
        onClick={onLike}
        className="w-16 h-16 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-colors"
      >
        <span className="text-green-600 text-2xl">♥</span>
      </button>
    </div>
  );
}
