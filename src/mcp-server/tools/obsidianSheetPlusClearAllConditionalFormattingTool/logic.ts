/**
 * @module ObsidianSheetPlusClearAllConditionalFormattingTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear All Conditional Formatting tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function clearAllConditionalFormatting(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  params: {
    sheetName?: string;
  },
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Clearing all conditional formatting for sheet: ${params.sheetName}`, requestContext);
    const response = await obsidianSheetPlusService.clearAllConditionalFormatting(params, requestContext);
    logger.info(`Cleared all conditional formatting successfully for sheet: ${params.sheetName}`, requestContext);
    
    return response;
  } catch (error) {
    logger.error(`Error clearing all conditional formatting for sheet: ${params.sheetName}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
