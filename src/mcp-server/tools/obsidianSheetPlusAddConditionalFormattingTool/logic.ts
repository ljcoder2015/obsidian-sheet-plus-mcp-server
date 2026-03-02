/**
 * @module ObsidianSheetPlusAddConditionalFormattingTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Add Conditional Formatting tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function addConditionalFormatting(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  sheetName: string | undefined,
  range: string,
  ruleType: string,
  condition: any,
  format: any | undefined,
  logger: any,
  requestContext: any,
) {
  try {
    const targetSheet = sheetName || "active sheet";
    
    // Convert string condition back to object if needed
    let processedCondition = condition;
    if (typeof condition === 'string') {
      try {
        processedCondition = JSON.parse(condition);
        logger.info(`Converted string condition to object: ${condition.substring(0, 100)}...`, requestContext);
      } catch (parseError) {
        logger.warn(`Failed to parse condition string: ${(parseError as Error).message}`, requestContext);
      }
    }
    
    // Convert string format back to object if needed
    let processedFormat = format;
    if (typeof format === 'string') {
      try {
        processedFormat = JSON.parse(format);
        logger.info(`Converted string format to object: ${format.substring(0, 100)}...`, requestContext);
      } catch (parseError) {
        logger.warn(`Failed to parse format string: ${(parseError as Error).message}`, requestContext);
      }
    }
    
    logger.info(`Adding conditional formatting to range ${range} in sheet: ${targetSheet}`, requestContext);
    const response = await obsidianSheetPlusService.addConditionalFormatting(sheetName, range, ruleType, processedCondition, processedFormat, requestContext);
    logger.info(`Conditional formatting added successfully to range ${range} in sheet: ${targetSheet}`, requestContext);
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    const targetSheet = sheetName || "active sheet";
    logger.error(`Error adding conditional formatting to range ${range} in sheet: ${targetSheet}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
