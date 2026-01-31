/**
 * @module ObsidianSheetPlusSetRangeStyleTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Set Range Style tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { SetRangeStyleParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function setRangeStyle(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: SetRangeStyleParams,
) {
  try {
    logger.info("Setting range style in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.setRangeStyle(params, requestContext);
    logger.info(`Range style set successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error setting range style", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
