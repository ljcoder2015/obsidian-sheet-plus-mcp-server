/**
 * @module ObsidianSheetPlusClearFormatTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear Format tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearFormatParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearFormat(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearFormatParams,
) {
  try {
    logger.info("Clearing format in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearFormat(params, requestContext);
    logger.info(`Format cleared successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing format", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
