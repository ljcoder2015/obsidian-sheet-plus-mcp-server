/**
 * @module ObsidianSheetPlusClearAllConditionalFormattingTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear All Conditional Formatting tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function clearAllConditionalFormatting(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    logger.info(`Clearing all conditional formatting from sheet: ${targetSheet}`, requestContext);
    const response = await obsidianSheetPlusService.clearAllConditionalFormatting(sheetName, requestContext);
    logger.info(`All conditional formatting cleared successfully from sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    logger.error(`Error clearing all conditional formatting from sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
