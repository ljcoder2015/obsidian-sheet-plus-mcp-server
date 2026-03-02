/**
 * @module ObsidianSheetPlusRemoveConditionalFormattingTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Remove Conditional Formatting tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function removeConditionalFormatting(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  range: string,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    logger.info(`Removing conditional formatting from range ${range} in sheet: ${targetSheet}`, requestContext);
    const response = await obsidianSheetPlusService.removeConditionalFormatting(sheetName, range, requestContext);
    logger.info(`Conditional formatting removed successfully from range ${range} in sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    logger.error(`Error removing conditional formatting from range ${range} in sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
