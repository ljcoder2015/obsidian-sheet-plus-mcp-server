/**
 * @module ObsidianSheetPlusSetFormulaTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Set Formula tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { SetFormulaParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function setFormula(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: SetFormulaParams,
) {
  try {
    logger.info("Setting formula in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.setFormula(params, requestContext);
    logger.info(`Formula set successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error setting formula", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
