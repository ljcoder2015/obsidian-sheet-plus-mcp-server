/**
 * @module ObsidianSheetPlusCreateSheetTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Create Sheet tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { CreateSheetParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function createSheet(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: CreateSheetParams,
) {
  try {
    logger.info("Creating sheet in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.createSheet(params, requestContext);
    logger.info(`Sheet created successfully: ${result.data?.name}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error creating sheet", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
