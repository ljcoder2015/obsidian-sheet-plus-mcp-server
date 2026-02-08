/**
 * @module ObsidianSheetPlusInsertColumnsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Insert Columns tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { InsertColumnsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function insertColumns(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: InsertColumnsParams,
) {
  try {
    logger.info("Inserting columns in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.insertColumns(params, requestContext);
    logger.info(`Columns inserted successfully at column ${params.columnIndex}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error inserting columns", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
