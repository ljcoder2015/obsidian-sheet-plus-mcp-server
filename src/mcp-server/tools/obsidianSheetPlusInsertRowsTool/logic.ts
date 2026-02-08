/**
 * @module ObsidianSheetPlusInsertRowsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Insert Rows tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { InsertRowsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function insertRows(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: InsertRowsParams,
) {
  try {
    logger.info("Inserting rows in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.insertRows(params, requestContext);
    logger.info(`Rows inserted successfully at row ${params.rowIndex}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error inserting rows", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
