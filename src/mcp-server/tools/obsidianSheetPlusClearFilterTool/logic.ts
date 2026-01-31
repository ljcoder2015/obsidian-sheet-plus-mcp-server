/**
 * @module ObsidianSheetPlusClearFilterTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear Filter tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearFilterParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearFilter(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearFilterParams,
) {
  try {
    logger.info("Clearing filter in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearFilter(params, requestContext);
    logger.info(`Filter cleared successfully for sheet ${params.sheetName}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing filter", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
