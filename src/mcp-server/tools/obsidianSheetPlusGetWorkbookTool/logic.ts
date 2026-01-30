/**
 * @module ObsidianSheetPlusGetWorkbookTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Workbook tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function getWorkbook(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
) {
  try {
    logger.info("Getting full workbook data", requestContext);
    const workbookData = await obsidianSheetPlusService.getWorkbook(requestContext);
    logger.info(`Retrieved workbook data with ${workbookData.sheets?.length || 0} sheets`, requestContext);
    
    return {
      success: true,
      data: workbookData,
    };
  } catch (error) {
    logger.error("Error getting workbook data", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
