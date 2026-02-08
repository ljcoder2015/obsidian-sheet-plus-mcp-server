/**
 * @module ObsidianSheetPlusAutoResizeRowsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Auto Resize Rows tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { AutoResizeRowsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function autoResizeRows(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: AutoResizeRowsParams,
) {
  try {
    logger.info("Auto resizing rows in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.autoResizeRows(params, requestContext);
    logger.info(`Rows resized successfully starting from row ${params.startRow}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error auto resizing rows", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
