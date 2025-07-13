import React from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Palette, ListOrdered as BorderAll, Type, MoreHorizontal } from 'lucide-react';

const Toolbar: React.FC = () => {
  return (
    <div className="flex items-center px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-1">
        <span className="text-sm text-gray-600 mr-3">Tool bar</span>
        
        {/* Formatting Tools */}
        <div className="flex items-center space-x-1 mr-4">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Bold className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Italic className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Underline className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Alignment Tools */}
        <div className="flex items-center space-x-1 mr-4">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <AlignLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <AlignCenter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <AlignRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Other Tools */}
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Type className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <Palette className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <BorderAll className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div className="ml-4 text-sm text-gray-600">
          Hide Fields
        </div>
      </div>
    </div>
  );
};

export default Toolbar;