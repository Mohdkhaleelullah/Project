import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Search, Bell, Share, Download, Upload, Plus, Filter, SortAsc as Sort, Eye } from 'lucide-react';
import SpreadsheetGrid from './SpreadsheetGrid';
import Toolbar from './Toolbar';
import StatusTabs from './StatusTabs';
import { SpreadsheetData, CellData } from './types';

const SpreadsheetApp: React.FC = () => {
  const [data, setData] = useState<SpreadsheetData>({
    A1: { value: 'Launch social media campaign for pro...', type: 'text' },
    B1: { value: '16-10-2024', type: 'date' },
    C1: { value: 'In progress', type: 'status', status: 'in-progress' },
    D1: { value: 'Asha Patel', type: 'text' },
    E1: { value: 'www.ashapatel...', type: 'url' },
    F1: { value: 'Sophie Choudhury', type: 'text' },
    G1: { value: 'Medium', type: 'priority', priority: 'medium' },
    H1: { value: '30-11-2024', type: 'date' },
    I1: { value: '6,200,000', type: 'number' },
    
    A2: { value: 'Update press kit for company rebrand', type: 'text' },
    B2: { value: '18-10-2024', type: 'date' },
    C2: { value: 'Need to start', type: 'status', status: 'need-to-start' },
    D2: { value: 'Max Khan', type: 'text' },
    E2: { value: 'www.maxkhan...', type: 'url' },
    F2: { value: 'Tyler Paisley', type: 'text' },
    G2: { value: 'High', type: 'priority', priority: 'high' },
    H2: { value: '30-10-2024', type: 'date' },
    I2: { value: '4,600,000', type: 'number' },
    
    A3: { value: 'Finalize user testing feedback for app...', type: 'text' },
    B3: { value: '05-10-2024', type: 'date' },
    C3: { value: 'In progress', type: 'status', status: 'in-progress' },
    D3: { value: 'Mark Johnson', type: 'text' },
    E3: { value: 'www.markjohns...', type: 'url' },
    F3: { value: 'Rachel Lee', type: 'text' },
    G3: { value: 'Medium', type: 'priority', priority: 'medium' },
    H3: { value: '15-10-2024', type: 'date' },
    I3: { value: '7,100,000', type: 'number' },
    
    A4: { value: 'Design new features for the website', type: 'text' },
    B4: { value: '10-10-2024', type: 'date' },
    C4: { value: 'Complete', type: 'status', status: 'complete' },
    D4: { value: 'Emily Green', type: 'text' },
    E4: { value: 'www.emilygreen...', type: 'url' },
    F4: { value: 'Tom Wright', type: 'text' },
    G4: { value: 'Low', type: 'priority', priority: 'low' },
    H4: { value: '15-10-2024', type: 'date' },
    I4: { value: '5,900,000', type: 'number' },
    
    A5: { value: 'Prepare financial report for Q3', type: 'text' },
    B5: { value: '20-10-2024', type: 'date' },
    C5: { value: 'Blocked', type: 'status', status: 'blocked' },
    D5: { value: 'James Brown', type: 'text' },
    E5: { value: 'www.jamesbrown...', type: 'url' },
    F5: { value: 'John Smith', type: 'text' },
    G5: { value: 'High', type: 'priority', priority: 'high' },
    H5: { value: '25-10-2024', type: 'date' },
    I5: { value: '3,400,000', type: 'number' },
    
    // Additional sample data for better filtering demonstration
    A6: { value: 'Review quarterly budget allocation', type: 'text' },
    B6: { value: '22-10-2024', type: 'date' },
    C6: { value: 'Pending', type: 'status', status: 'pending' },
    D6: { value: 'Sarah Wilson', type: 'text' },
    E6: { value: 'www.sarahwilson...', type: 'url' },
    F6: { value: 'Mike Davis', type: 'text' },
    G6: { value: 'Medium', type: 'priority', priority: 'medium' },
    H6: { value: '28-10-2024', type: 'date' },
    I6: { value: '2,800,000', type: 'number' },
    
    A7: { value: 'Conduct team performance reviews', type: 'text' },
    B7: { value: '25-10-2024', type: 'date' },
    C7: { value: 'Reviewed', type: 'status', status: 'reviewed' },
    D7: { value: 'Lisa Chen', type: 'text' },
    E7: { value: 'www.lisachen...', type: 'url' },
    F7: { value: 'David Kim', type: 'text' },
    G7: { value: 'High', type: 'priority', priority: 'high' },
    H7: { value: '31-10-2024', type: 'date' },
    I7: { value: '1,500,000', type: 'number' },
    
    A8: { value: 'Process new client onboarding', type: 'text' },
    B8: { value: '28-10-2024', type: 'date' },
    C8: { value: 'Arrived', type: 'status', status: 'arrived' },
    D8: { value: 'Robert Taylor', type: 'text' },
    E8: { value: 'www.roberttaylor...', type: 'url' },
    F8: { value: 'Anna Martinez', type: 'text' },
    G8: { value: 'Low', type: 'priority', priority: 'low' },
    H8: { value: '05-11-2024', type: 'date' },
    I8: { value: '4,200,000', type: 'number' },
  });

  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('All Orders');

  // Filter data based on active tab
  const filteredData = useMemo(() => {
    if (activeTab === 'All Orders') return data;
    
    const filteredEntries: SpreadsheetData = {};
    const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    
    // Get all row numbers that have data
    const rowNumbers = new Set<number>();
    Object.keys(data).forEach(cellId => {
      const rowNum = parseInt(cellId.slice(1));
      if (!isNaN(rowNum)) {
        rowNumbers.add(rowNum);
      }
    });
    
    // Filter rows based on status
    Array.from(rowNumbers).forEach(rowNum => {
      const statusCellId = `C${rowNum}`;
      const statusCell = data[statusCellId];
      
      if (statusCell) {
        const shouldIncludeRow = (() => {
          switch (activeTab.toLowerCase()) {
            case 'pending':
              return statusCell.value.toLowerCase().includes('pending') || 
                     statusCell.value.toLowerCase().includes('need to start');
            case 'reviewed':
              return statusCell.value.toLowerCase().includes('reviewed') || 
                     statusCell.value.toLowerCase().includes('complete');
            case 'arrived':
              return statusCell.value.toLowerCase().includes('arrived') || 
                     statusCell.value.toLowerCase().includes('blocked');
            default:
              return true;
          }
        })();
        
        if (shouldIncludeRow) {
          // Include all cells from this row
          columns.forEach(col => {
            const cellId = `${col}${rowNum}`;
            if (data[cellId]) {
              filteredEntries[cellId] = data[cellId];
            }
          });
        }
      }
    });
    
    return filteredEntries;
  }, [data, activeTab]);

  const updateCell = useCallback((cellId: string, value: string) => {
    console.log('Cell updated:', cellId, 'New value:', value);
    setData(prev => ({
      ...prev,
      [cellId]: { ...prev[cellId], value }
    }));
  }, []);

  const handleTabChange = (tabName: string) => {
    console.log('Tab clicked:', tabName);
    setActiveTab(tabName);
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">S</span>
            </div>
            <span className="text-sm text-gray-600">Workspace</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm text-gray-600">Folder 1</span>
            <span className="text-gray-400">/</span>
            <span className="text-sm font-medium">Spreadsheet 3</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search with sheet"
              className="pl-10 pr-4 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-500 cursor-pointer hover:text-gray-700" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="text-sm font-medium">John Doe</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Action Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm bg-orange-100 text-orange-800 rounded-md font-medium">
              Answer a question
            </button>
            <span className="text-sm text-gray-600">Extract</span>
            <span className="text-sm text-gray-600">Edit Value</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              <Share className="w-4 h-4" />
              <span>Share</span>
            </button>
            <button className="flex items-center space-x-1 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              <span>New Action</span>
            </button>
          </div>
        </div>

        {/* Spreadsheet Grid */}
        <div className="flex-1 overflow-auto">
          <SpreadsheetGrid
            data={filteredData}
            selectedCell={selectedCell}
            onCellSelect={setSelectedCell}
            onCellUpdate={updateCell}
          />
        </div>

        {/* Status Tabs */}
        <StatusTabs activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
};

export default SpreadsheetApp;