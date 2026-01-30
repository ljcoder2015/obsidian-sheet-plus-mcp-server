/**
 * @module ObsidianSheetPlusGetSheetListTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Sheet List tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function getSheetList(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
) {
  try {
    logger.info("Getting sheet list from Obsidian Sheet Plus API", requestContext);
    const sheetList = await obsidianSheetPlusService.getSheetList(requestContext);
    logger.info(`Retrieved ${sheetList.length} sheets`, requestContext);
    
    return {
      success: true,
      data: sheetList,
    };
  } catch (error) {
    logger.error("Error getting sheet list", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
