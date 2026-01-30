/**
 * @module ObsidianSheetPlusGetWorkbookDataTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Workbook Data tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function getWorkbookData(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Getting workbook data`, requestContext);
    const workbookData = await obsidianSheetPlusService.getWorkbookData(requestContext);
    logger.info(`Retrieved workbook data successfully`, requestContext);
    
    return workbookData;
  } catch (error) {
    logger.error(`Error getting workbook data`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
