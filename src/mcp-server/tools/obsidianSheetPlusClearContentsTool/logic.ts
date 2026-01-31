/**
 * @module ObsidianSheetPlusClearContentsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear Contents tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearContentsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearContents(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearContentsParams,
) {
  try {
    logger.info("Clearing contents in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearContents(params, requestContext);
    logger.info(`Contents cleared successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing contents", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
