/**
 * @module ObsidianSheetPlusGetSheetDataTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Sheet Data tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function getSheetData(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string,
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Getting sheet data for sheet: ${sheetName}`, requestContext);
    const sheetData = await obsidianSheetPlusService.getSheetData(sheetName, requestContext);
    logger.info(`Retrieved data for sheet: ${sheetName}`, requestContext);
    
    return {
      success: true,
      data: sheetData,
    };
  } catch (error) {
    logger.error(`Error getting sheet data for sheet: ${sheetName}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
