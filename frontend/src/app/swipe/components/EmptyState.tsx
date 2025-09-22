import React from "react";

type TabType = "apartments" | "people" | "spots";

interface EmptyStateProps {
  activeTab: TabType;
  onRefresh: () => void;
}

export default function EmptyState({ activeTab, onRefresh }: EmptyStateProps) {
  const getEmptyStateContent = () => {
    switch (activeTab) {
      case "apartments":
        return {
          icon: "home",
          title: "No More Apartments!",
          subtitle:
            "You've seen all available apartments in your area. Check back later for new listings!",
        };
      case "people":
        return {
          icon: "people",
          title: "No More People!",
          subtitle:
            "You've seen everyone nearby. Try expanding your preferences to see more people.",
        };
      case "spots":
        return {
          icon: "location",
          title: "No More Spots!",
          subtitle:
            "You've explored all the spots in your area. New places are added all the time!",
        };
      default:
        return {
          icon: "flag",
          title: `No More ${activeTab}!`,
          subtitle: "Check back later for new recommendations.",
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    // --- NEW: Red-themed card container ---
    <div className="max-w-sm p-8 mx-auto text-center bg-white border-2 border-red-100 shadow-xl rounded-3xl">
      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full">
        <span className="text-4xl">{content.icon}</span>
      </div>

      <h3 className="mb-2 text-2xl font-bold text-gray-800">{content.title}</h3>

      <p className="mb-8 leading-relaxed text-gray-600">{content.subtitle}</p>

      <button
        onClick={onRefresh}
        className="px-8 py-4 font-semibold text-white transition-transform duration-200 transform bg-red-500 shadow-lg hover:bg-red-600 rounded-2xl hover:scale-105 active:scale-95"
      >
        Refresh Feed
      </button>
    </div>
  );
}
