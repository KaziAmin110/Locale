import React from "react";

type TabType = "apartments" | "people" | "spots";

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const tabs: { key: TabType; label: string; icon: string }[] = [
    { key: "apartments", label: "Apartments", icon: "" },
    { key: "people", label: "People", icon: "" },
    { key: "spots", label: "Spots", icon: "" },
  ];

  return (
    <div className="flex p-1 mt-5 bg-white border border-gray-100 shadow-sm md:mt-10 rounded-2xl">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
            activeTab === tab.key
              ? "bg-primary text-white shadow-sm transform scale-[1.02]"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <span className="text-lg">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
