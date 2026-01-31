/**
 * @module ObsidianSheetPlusClearHyperlinksTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Clear Hyperlinks tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { ClearHyperlinksParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function clearHyperlinks(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: ClearHyperlinksParams,
) {
  try {
    logger.info("Clearing hyperlinks in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.clearHyperlinks(params, requestContext);
    logger.info(`Hyperlinks cleared successfully for range ${params.range}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error clearing hyperlinks", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
