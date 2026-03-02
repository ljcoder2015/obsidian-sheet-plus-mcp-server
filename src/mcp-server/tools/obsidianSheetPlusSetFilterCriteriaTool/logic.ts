/**
 * @module ObsidianSheetPlusSetFilterCriteriaTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Set Filter Criteria tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function setFilterCriteria(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  range: string,
  criteria: any,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    logger.info(`Setting filter criteria for range ${range} in sheet: ${targetSheet}`, requestContext);
    const response = await obsidianSheetPlusService.setFilterCriteria(sheetName, range, criteria, requestContext);
    logger.info(`Filter criteria set successfully for range ${range} in sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    logger.error(`Error setting filter criteria for range ${range} in sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
