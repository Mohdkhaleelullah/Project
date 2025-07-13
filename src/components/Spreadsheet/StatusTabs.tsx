import React from 'react';
import { Plus } from 'lucide-react';

interface StatusTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StatusTabs: React.FC<StatusTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { name: 'All Orders', count: null },
    { name: 'Pending', count: null },
    { name: 'Reviewed', count: null },
    { name: 'Arrived', count: null },
  ];

  const handleTabClick = (tabName: string) => {
    console.log('Tab clicked:', tabName);
    onTabChange(tabName);
  };

  return (
    <div className="flex items-center px-4 py-2 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.name)}
            className={`text-sm font-medium pb-2 border-b-2 transition-colors hover:text-blue-600 ${
              activeTab === tab.name
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            {tab.name}
            {tab.count && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
        
        <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
          <Plus className="w-4 h-4 mr-1" />
        </button>
      </div>
    </div>
  );
};

export default StatusTabs;