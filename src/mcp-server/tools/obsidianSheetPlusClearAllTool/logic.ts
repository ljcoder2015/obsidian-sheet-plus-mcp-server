/**
 * @module ObsidianSheetPlusClearAllTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear All tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearAllParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearAll(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearAllParams,
) {
  try {
    logger.info("Clearing all in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearAll(params, requestContext);
    logger.info(`All cleared successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing all", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
