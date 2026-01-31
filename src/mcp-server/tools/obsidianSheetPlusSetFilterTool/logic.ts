/**
 * @module ObsidianSheetPlusSetFilterTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Set Filter tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { SetFilterParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function setFilter(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: SetFilterParams,
) {
  try {
    logger.info("Setting filter in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.setFilter(params, requestContext);
    logger.info(`Filter set successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error setting filter", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
