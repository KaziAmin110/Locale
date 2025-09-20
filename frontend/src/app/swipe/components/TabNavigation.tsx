'use client';

interface TabNavigationProps {
  activeTab: 'apartments' | 'people' | 'spots';
  onTabChange: (tab: 'apartments' | 'people' | 'spots') => void;
  stats: {
    apartments: number;
    people: number;
    spots: number;
  };
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, stats }) => {
  const tabs = [
    { id: 'apartments' as const, label: 'Homes', icon: '🏠' },
    { id: 'people' as const, label: 'People', icon: '👥' },
    { id: 'spots' as const, label: 'Places', icon: '📍' }
  ];

  return (
    <div className="tab-navigation">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-icon">{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;