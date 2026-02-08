/**
 * @module ObsidianSheetPlusDeleteRowsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Delete Rows tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { DeleteRowsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function deleteRows(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: DeleteRowsParams,
) {
  try {
    logger.info("Deleting rows in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.deleteRows(params, requestContext);
    logger.info(`Rows deleted successfully at row ${params.rowIndex}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error deleting rows", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
