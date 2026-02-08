/**
 * @module ObsidianSheetPlusGetMaxColumnsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Get Max Columns tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { GetMaxColumnsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function getMaxColumns(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: GetMaxColumnsParams,
) {
  try {
    logger.info("Getting max columns in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.getMaxColumns(params, requestContext);
    logger.info(`Max columns retrieved successfully`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error getting max columns", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
