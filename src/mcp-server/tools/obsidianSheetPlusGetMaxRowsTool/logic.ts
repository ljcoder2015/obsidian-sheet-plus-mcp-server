/**
 * @module ObsidianSheetPlusGetMaxRowsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Max Rows tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { GetMaxRowsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function getMaxRows(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: GetMaxRowsParams,
) {
  try {
    logger.info("Getting max rows in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.getMaxRows(params, requestContext);
    logger.info(`Max rows retrieved successfully`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error getting max rows", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
