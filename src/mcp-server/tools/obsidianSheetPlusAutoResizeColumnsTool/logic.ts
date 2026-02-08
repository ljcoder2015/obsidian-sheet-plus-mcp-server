/**
 * @module ObsidianSheetPlusAutoResizeColumnsTool Logic
 * @description
 * Contains the logic for the Obsidian Sheet Plus Auto Resize Columns tool.
 */

import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { AutoResizeColumnsParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

export async function autoResizeColumns(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
  logger: any,
  requestContext: any,
  params: AutoResizeColumnsParams,
) {
  try {
    logger.info("Auto resizing columns in Obsidian Sheet Plus API", requestContext);
    const result = await obsidianSheetPlusService.autoResizeColumns(params, requestContext);
    logger.info(`Columns resized successfully starting from column ${params.startColumn}`, requestContext);
    
    return result;
  } catch (error) {
    logger.error("Error auto resizing columns", error, requestContext);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
