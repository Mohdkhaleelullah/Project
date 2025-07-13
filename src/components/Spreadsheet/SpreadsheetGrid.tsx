import React, { useState, useRef, useEffect } from 'react';
import { SpreadsheetData, CellData } from './types';
import Cell from './Cell';

interface SpreadsheetGridProps {
  data: SpreadsheetData;
  selectedCell: string | null;
  onCellSelect: (cellId: string | null) => void;
  onCellUpdate: (cellId: string, value: string) => void;
}

const SpreadsheetGrid: React.FC<SpreadsheetGridProps> = ({
  data,
  selectedCell,
  onCellSelect,
  onCellUpdate,
}) => {
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [focusedCell, setFocusedCell] = useState<{ row: number; col: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const columns = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
  const rows = Array.from({ length: 20 }, (_, i) => i + 1);

  const columnHeaders = [
    'Task', 'Start Date', 'Status', 'Submitter', 'URL', 'Assignee', 'Priority', 'Due Date', 'Budget'
  ];

  // Define constant column widths
  const columnWidths = [
    'w-80',  // Task - wider for longer text
    'w-32',  // Start Date
    'w-32',  // Status
    'w-36',  // Submitter
    'w-40',  // URL
    'w-36',  // Assignee
    'w-24',  // Priority
    'w-32',  // Due Date
    'w-32',  // Budget
  ];

  const getCellId = (col: string, row: number) => `${col}${row}`;

  const handleCellClick = (cellId: string) => {
    console.log('Cell clicked:', cellId);
    onCellSelect(cellId);
    
    // Update focused cell for keyboard navigation
    const [col, rowStr] = [cellId[0], cellId.slice(1)];
    const row = parseInt(rowStr);
    const colIndex = columns.indexOf(col);
    setFocusedCell({ row, col: colIndex });
  };

  const handleCellDoubleClick = (cellId: string) => {
    console.log('Cell double-clicked for editing:', cellId);
    setEditingCell(cellId);
  };

  const handleCellBlur = () => {
    setEditingCell(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!selectedCell || editingCell) return;

    const [col, rowStr] = [selectedCell[0], selectedCell.slice(1)];
    const row = parseInt(rowStr);
    const colIndex = columns.indexOf(col);

    let newCell = selectedCell;
    let newFocusedCell = focusedCell;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (row > 1) {
          newCell = getCellId(col, row - 1);
          newFocusedCell = { row: row - 1, col: colIndex };
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (row < rows.length) {
          newCell = getCellId(col, row + 1);
          newFocusedCell = { row: row + 1, col: colIndex };
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (colIndex > 0) {
          newCell = getCellId(columns[colIndex - 1], row);
          newFocusedCell = { row, col: colIndex - 1 };
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (colIndex < columns.length - 1) {
          newCell = getCellId(columns[colIndex + 1], row);
          newFocusedCell = { row, col: colIndex + 1 };
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (row < rows.length) {
          newCell = getCellId(col, row + 1);
          newFocusedCell = { row: row + 1, col: colIndex };
        }
        break;
      case 'Tab':
        e.preventDefault();
        if (colIndex < columns.length - 1) {
          newCell = getCellId(columns[colIndex + 1], row);
          newFocusedCell = { row, col: colIndex + 1 };
        } else if (row < rows.length) {
          newCell = getCellId(columns[0], row + 1);
          newFocusedCell = { row: row + 1, col: 0 };
        }
        break;
      case 'F2':
        e.preventDefault();
        setEditingCell(selectedCell);
        break;
      case 'Escape':
        e.preventDefault();
        setEditingCell(null);
        break;
    }

    if (newCell !== selectedCell) {
      console.log('Keyboard navigation:', selectedCell, '->', newCell);
      onCellSelect(newCell);
      setFocusedCell(newFocusedCell);
    }
  };

  useEffect(() => {
    if (gridRef.current && !editingCell) {
      gridRef.current.focus();
    }
  }, [selectedCell, editingCell]);

  return (
    <div
      ref={gridRef}
      className="outline-none"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="inline-block min-w-full">
        {/* Header Row */}
        <div className="flex bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
          <div className="w-12 h-10 border-r border-gray-200 bg-gray-100 flex-shrink-0"></div>
          {columns.map((col, index) => (
            <div
              key={col}
              className={`${columnWidths[index]} h-10 px-3 border-r border-gray-200 flex items-center bg-gray-50 flex-shrink-0`}
            >
              <span className="text-xs font-medium text-gray-600 truncate">
                {columnHeaders[index] || col}
              </span>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {rows.map((row) => {
          // Check if this row has any data in the filtered dataset
          const hasData = columns.some(col => data[getCellId(col, row)]);
          
          // Only render rows that have data or are within the first few rows
          if (!hasData && row > 10) return null;
          
          return (
            <div key={row} className="flex border-b border-gray-200 hover:bg-gray-50">
              {/* Row Number */}
              <div className="w-12 h-10 border-r border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0">
                <span className="text-xs text-gray-500">{row}</span>
              </div>
              
              {/* Data Cells */}
              {columns.map((col, index) => {
                const cellId = getCellId(col, row);
                const cellData = data[cellId];
                const isSelected = selectedCell === cellId;
                const isEditing = editingCell === cellId;

                return (
                  <Cell
                    key={cellId}
                    cellId={cellId}
                    data={cellData}
                    isSelected={isSelected}
                    isEditing={isEditing}
                    onClick={() => handleCellClick(cellId)}
                    onDoubleClick={() => handleCellDoubleClick(cellId)}
                    onBlur={handleCellBlur}
                    onUpdate={onCellUpdate}
                    width={columnWidths[index]}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpreadsheetGrid;