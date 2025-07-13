import React, { useState, useRef, useEffect } from 'react';
import { CellData } from './types';

interface CellProps {
  cellId: string;
  data?: CellData;
  isSelected: boolean;
  isEditing: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
  onBlur: () => void;
  onUpdate: (cellId: string, value: string) => void;
  width: string;
}

const Cell: React.FC<CellProps> = ({
  cellId,
  data,
  isSelected,
  isEditing,
  onClick,
  onDoubleClick,
  onBlur,
  onUpdate,
  width,
}) => {
  const [editValue, setEditValue] = useState(data?.value || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setEditValue(data?.value || '');
  }, [data?.value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Cell value updated via Enter:', cellId, editValue);
      onUpdate(cellId, editValue);
      onBlur();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      console.log('Cell value updated via Tab:', cellId, editValue);
      onUpdate(cellId, editValue);
      onBlur();
    } else if (e.key === 'Escape') {
      console.log('Cell edit cancelled:', cellId);
      setEditValue(data?.value || '');
      onBlur();
    }
  };

  const handleBlur = () => {
    console.log('Cell value updated via blur:', cellId, editValue);
    onUpdate(cellId, editValue);
    onBlur();
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      'in-progress': 'bg-blue-100 text-blue-800',
      'need-to-start': 'bg-red-100 text-red-800',
      'complete': 'bg-green-100 text-green-800',
      'blocked': 'bg-gray-100 text-gray-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'reviewed': 'bg-purple-100 text-purple-800',
      'arrived': 'bg-indigo-100 text-indigo-800',
    };

    const normalizedStatus = status.toLowerCase().replace(/\s+/g, '-');
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[normalizedStatus as keyof typeof statusStyles] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityStyles = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'low': 'bg-green-100 text-green-800',
    };

    const normalizedPriority = priority.toLowerCase();
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityStyles[normalizedPriority as keyof typeof priorityStyles] || 'bg-gray-100 text-gray-800'}`}>
        {priority}
      </span>
    );
  };

  const renderCellContent = () => {
    if (!data) return '';

    switch (data.type) {
      case 'status':
        return getStatusBadge(data.status || data.value);
      case 'priority':
        return getPriorityBadge(data.priority || data.value);
      case 'url':
        return (
          <a 
            href={`https://${data.value}`} 
            className="text-blue-600 hover:text-blue-800 truncate block"
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            {data.value}
          </a>
        );
      case 'number':
        return new Intl.NumberFormat().format(parseInt(data.value.replace(/,/g, '')));
      case 'date':
        return data.value;
      default:
        return data.value;
    }
  };

  return (
    <div
      className={`${width} h-10 border-r border-gray-200 relative cursor-cell flex-shrink-0 ${
        isSelected ? 'ring-2 ring-blue-500 ring-inset bg-blue-50' : ''
      } ${isEditing ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          className="w-full h-full px-3 text-sm border-none outline-none bg-white"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="w-full h-full px-3 flex items-center text-sm text-gray-900 overflow-hidden">
          <div className="truncate w-full">
            {renderCellContent()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cell;