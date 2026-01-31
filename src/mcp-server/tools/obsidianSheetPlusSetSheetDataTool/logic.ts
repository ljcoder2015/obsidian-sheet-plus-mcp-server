/**
 * @module ObsidianSheetPlusSetSheetDataTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Set Sheet Data tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import type { SetSheetDataParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function setSheetData(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  params: SetSheetDataParams,
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Setting sheet data for sheet: ${params.sheetName}`, requestContext);
    logger.debug(`Setting ${params.values?.length || 0} cells`, requestContext);
    const result = await obsidianSheetPlusService.setSheetData(params, requestContext);
    logger.info(`Successfully set sheet data for sheet: ${params.sheetName}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error(`Error setting sheet data for sheet: ${params.sheetName}`, error, requestContext);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
