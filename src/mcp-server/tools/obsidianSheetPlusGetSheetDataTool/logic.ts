/**
 * @module ObsidianSheetPlusGetSheetDataTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Sheet Data tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function getSheetData(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  range: string | undefined,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    logger.info(`Getting sheet data for sheet: ${targetSheet}`, requestContext);
    const sheetData = await obsidianSheetPlusService.getSheetData(sheetName, range, requestContext);
    logger.info(`Retrieved data for sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: sheetData,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    logger.error(`Error getting sheet data for sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
