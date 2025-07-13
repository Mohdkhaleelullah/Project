export interface CellData {
  value: string;
  type: 'text' | 'number' | 'date' | 'status' | 'priority' | 'url';
  status?: string;
  priority?: string;
}

export interface SpreadsheetData {
  [cellId: string]: CellData;
}