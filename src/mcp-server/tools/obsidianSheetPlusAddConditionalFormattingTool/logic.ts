/**
 * @module ObsidianSheetPlusAddConditionalFormattingTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Add Conditional Formatting tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function addConditionalFormatting(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  params: {
    sheetName?: string;
    range: string;
    ruleType: string;
    condition: any;
    format?: any;
  },
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Adding conditional formatting for sheet: ${params.sheetName}, range: ${params.range}, ruleType: ${params.ruleType}`, requestContext);
    const response = await obsidianSheetPlusService.addConditionalFormatting(params, requestContext);
    logger.info(`Added conditional formatting successfully for sheet: ${params.sheetName}`, requestContext);
    
    return response;
  } catch (error) {
    logger.error(`Error adding conditional formatting for sheet: ${params.sheetName}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
