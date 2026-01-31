/**
 * @module ObsidianSheetPlusCheckStatusTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Check Status tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function checkStatus(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
) {
  try {
    logger.info("Checking status of Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.checkStatus(requestContext);
    logger.info("Status check completed successfully", requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error checking status", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
