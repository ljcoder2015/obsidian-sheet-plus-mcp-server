/**
 * @module ObsidianSheetPlusClearDataValidationTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear Data Validation tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearDataValidationParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearDataValidation(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearDataValidationParams,
) {
  try {
    logger.info("Clearing data validation in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearDataValidation(params, requestContext);
    logger.info(`Data validation cleared successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing data validation", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
