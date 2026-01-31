/**
 * @module ObsidianSheetPlusClearCommentsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear Comments tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearCommentsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearComments(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearCommentsParams,
) {
  try {
    logger.info("Clearing comments in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearComments(params, requestContext);
    logger.info(`Comments cleared successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing comments", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
