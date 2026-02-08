/**
 * @module ObsidianSheetPlusUnmergeCellsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Unmerge Cells tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { UnmergeCellsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function unmergeCells(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: UnmergeCellsParams,
) {
  try {
    logger.info("Unmerging cells in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.unmergeCells(params, requestContext);
    logger.info(`Cells unmerged successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error unmerging cells", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
