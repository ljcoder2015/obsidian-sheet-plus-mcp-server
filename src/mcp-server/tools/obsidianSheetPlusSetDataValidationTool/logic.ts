/**
 * @module ObsidianSheetPlusSetDataValidationTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Set Data Validation tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";

export async function setDataValidation(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  params: {
    sheetName?: string;
    range: string;
    type?: string;
    formula1?: string;
    formula2?: string;
    operator?: string;
    allowBlank?: boolean;
    showErrorMessage?: boolean;
    errorMessage?: string;
  },
  logger: any,
  requestContext: any,
) {
  try {
    logger.info(`Setting data validation for sheet: ${params.sheetName}, range: ${params.range}`, requestContext);
    const response = await obsidianSheetPlusService.setDataValidation(params, requestContext);
    logger.info(`Set data validation successfully for sheet: ${params.sheetName}`, requestContext);
    
    return response;
  } catch (error) {
    logger.error(`Error setting data validation for sheet: ${params.sheetName}`, error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

