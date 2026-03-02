/**
 * @module ObsidianSheetPlusAddFilterTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Add Filter tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function addFilter(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  range: string,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    logger.info(`Adding filter to range ${range} in sheet: ${targetSheet}`, requestContext);
    const response = await obsidianSheetPlusService.addFilter(sheetName, range, requestContext);
    logger.info(`Filter added successfully to range ${range} in sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    logger.error(`Error adding filter to range ${range} in sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
