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
          icon: "🏠",
          title: "No more apartments!",
          subtitle: "You've seen all available apartments in your area",
        };
      case "people":
        return {
          icon: "👥",
          title: "No more people!",
          subtitle: "You've seen everyone nearby",
        };
      case "spots":
        return {
          icon: "📍",
          title: "No more spots!",
          subtitle: "You've explored all the spots in your area",
        };
      default:
        return {
          icon: "🏁",
          title: `No more ${activeTab}!`,
          subtitle: "Check back later for new recommendations",
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="max-w-sm mx-auto text-center">
      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full">
        <span className="text-4xl">{content.icon}</span>
      </div>

      <h3 className="mb-2 text-2xl font-bold text-gray-900">{content.title}</h3>

      <p className="mb-8 leading-relaxed text-gray-600">{content.subtitle}</p>

      <button
        onClick={onRefresh}
        className="px-8 py-4 font-semibold text-white transition-all duration-200 transform shadow-lg bg-primary hover:bg-primary-hover rounded-2xl hover:scale-105 active:scale-95"
      >
        Start Over
      </button>
    </div>
  );
}
