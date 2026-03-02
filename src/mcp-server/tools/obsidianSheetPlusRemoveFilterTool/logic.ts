/**
 * @module ObsidianSheetPlusRemoveFilterTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Remove Filter tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function removeFilter(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  range: string | undefined,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    const targetRange = range || "entire sheet";
    logger.info(`Removing filter from ${targetRange} in sheet: ${targetSheet}`, requestContext);
    const response = await obsidianSheetPlusService.removeFilter(sheetName, range, requestContext);
    logger.info(`Filter removed successfully from ${targetRange} in sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    const targetRange = range || "entire sheet";
    logger.error(`Error removing filter from ${targetRange} in sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
