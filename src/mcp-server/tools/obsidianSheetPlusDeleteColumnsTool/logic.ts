/**
 * @module ObsidianSheetPlusDeleteColumnsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Delete Columns tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { DeleteColumnsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function deleteColumns(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: DeleteColumnsParams,
) {
  try {
    logger.info("Deleting columns in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.deleteColumns(params, requestContext);
    logger.info(`Columns deleted successfully at column ${params.columnIndex}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error deleting columns", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
