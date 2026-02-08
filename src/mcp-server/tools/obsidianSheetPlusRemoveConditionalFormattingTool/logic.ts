/**
 * @module ObsidianSheetPlusRemoveConditionalFormattingTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Remove Conditional Formatting tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function removeConditionalFormatting(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  params: {
    sheetName?: string;
    range: string;
  },
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Removing conditional formatting for sheet: ${params.sheetName}, range: ${params.range}`, requestContext);
    const response = await obsidianSheetPlusService.removeConditionalFormatting(params, requestContext);
    logger.info(`Removed conditional formatting successfully for sheet: ${params.sheetName}`, requestContext);
    
    return response;
  } catch (error) {
    logger.error(`Error removing conditional formatting for sheet: ${params.sheetName}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
