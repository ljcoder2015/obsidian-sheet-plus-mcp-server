/**
 * @module ObsidianSheetPlusRestApiService Types
 * @description
 * Type definitions for the Obsidian Sheet Plus REST API service.
 */

/**
 * Represents the status of the Obsidian Sheet Plus REST API.
 */
export interface ObsidianSheetPlusApiStatusResponse {
  success: boolean;
  message?: string;
  version?: string;
}

/**
 * Represents a sheet in the workbook.
 */
export interface SheetInfo {
  id: string;
  name: string;
  index: number;
}

/**
 * Represents cell data in a sheet.
 */
export interface CellData {
  row: number;
  column: number;
  value: any;
  formula?: string;
  style?: any;
}

/**
 * Represents sheet data with cells and range information.
 */
export interface SheetData {
  sheetId: string;
  sheetName: string;
  cells: CellData[];
  range?: {
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
  };
}

/**
 * Represents workbook data with all sheets.
 */
export interface WorkbookData {
  sheets: SheetData[];
  // Additional workbook-level data if needed
}

/**
 * Parameters for setting sheet data.
 */
export interface SetSheetDataParams {
  sheetName?: string;
  values: any[][];
  range: string;
}

/**
 * Parameters for creating a new sheet.
 */
export interface CreateSheetParams {
  sheetName: string;
  columns?: number;
  rows?: number;
}

/**
 * Parameters for setting a formula.
 */
export interface SetFormulaParams {
  sheetName?: string;
  range: string;
  formula: string;
}

/**
 * Parameters for setting range style.
 */
export interface SetRangeStyleParams {
  sheetName?: string;
  range: string;
  style: any;
}

/**
 * Parameters for setting data validation.
 */
export interface SetDataValidationParams {
  sheetName?: string;
  range: string;
  type?: string;
  formula1?: string;
  formula2?: string;
  operator?: string;
  allowBlank?: boolean;
  showErrorMessage?: boolean;
  errorMessage?: string;
}


/**
 * Parameters for setting filter.
 */
export interface SetFilterParams {
  sheetName: string;
  range: string;
  columnFilters?: Record<string, string[]>;
}

/**
 * Parameters for clearing filter.
 */
export interface ClearFilterParams {
  sheetName: string;
  columnIndex?: number;
  removeFilter?: boolean;
}

/**
 * Parameters for clearing contents.
 */
export interface ClearContentsParams {
  sheetName: string;
  range: string;
}

/**
 * Parameters for clearing format.
 */
export interface ClearFormatParams {
  sheetName: string;
  range: string;
}

/**
 * Parameters for clearing comments.
 */
export interface ClearCommentsParams {
  sheetName: string;
  range: string;
}

/**
 * Parameters for clearing hyperlinks.
 */
export interface ClearHyperlinksParams {
  sheetName: string;
  range: string;
}

/**
 * Parameters for clearing all.
 */
export interface ClearAllParams {
  sheetName: string;
  range: string;
}

/**
 * Parameters for clearing data validation.
 */
export interface ClearDataValidationParams {
  sheetName: string;
  range: string;
}

/**
 * Parameters for adding conditional formatting.
 */
export interface AddConditionalFormattingParams {
  sheetName?: string;
  range: string;
  ruleType: string;
  condition: any;
  format?: any;
}

/**
 * Parameters for removing conditional formatting.
 */
export interface RemoveConditionalFormattingParams {
  sheetName?: string;
  range: string;
}

/**
 * Parameters for clearing all conditional formatting.
 */
export interface ClearAllConditionalFormattingParams {
  sheetName?: string;
}

/**
 * Parameters for inserting rows.
 */
export interface InsertRowsParams {
  sheetName?: string;
  rowIndex: number;
  numberOfRows: number;
}

/**
 * Parameters for deleting rows.
 */
export interface DeleteRowsParams {
  sheetName?: string;
  rowIndex: number;
  numberOfRows: number;
}

/**
 * Parameters for inserting columns.
 */
export interface InsertColumnsParams {
  sheetName?: string;
  columnIndex: number;
  numberOfColumns: number;
}

/**
 * Parameters for deleting columns.
 */
export interface DeleteColumnsParams {
  sheetName?: string;
  columnIndex: number;
  numberOfColumns: number;
}

/**
 * Parameters for auto resizing rows.
 */
export interface AutoResizeRowsParams {
  sheetName?: string;
  startRow: number;
  numberOfRows: number;
}

/**
 * Parameters for auto resizing columns.
 */
export interface AutoResizeColumnsParams {
  sheetName?: string;
  startColumn: number;
  numberOfColumns: number;
}

/**
 * Parameters for getting max rows.
 */
export interface GetMaxRowsParams {
  sheetName?: string;
}

/**
 * Parameters for getting max columns.
 */
export interface GetMaxColumnsParams {
  sheetName?: string;
}

/**
 * Parameters for merging cells.
 */
export interface MergeCellsParams {
  sheetName?: string;
  range: string;
}

/**
 * Parameters for unmerging cells.
 */
export interface UnmergeCellsParams {
  sheetName?: string;
  range: string;
}
