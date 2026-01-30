/**
 * @module ObsidianSheetPlusSetSheetDataTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Sheet Data tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import {
  ErrorHandler,
  logger,
  RequestContext,
  requestContextService,
} from "../../../utils/index.js";
import { z } from "zod";
import { setSheetData } from "./logic.js";
import type { SetSheetDataParams } from "../../../services/obsidianSheetPlusRestAPI/types.js";

// Define input schema using Zod
const ObsidianSheetPlusSetSheetDataInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet to set data to"),
  cells: z.array(
    z.object({
      row: z.number().describe("The row index"),
      column: z.number().describe("The column index"),
      value: z.any().describe("The cell value"),
      formula: z.string().optional().describe("The cell formula"),
      style: z.object({}).optional().describe("The cell style"),
    })
  ).describe("The cell data to set"),
  range: z.object({
    startRow: z.number().describe("The start row index"),
    startColumn: z.number().describe("The start column index"),
    endRow: z.number().describe("The end row index"),
    endColumn: z.number().describe("The end column index"),
  }).optional().describe("The data range"),
});

export async function registerObsidianSheetPlusSetSheetDataTool(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  const toolName = "obsidian_sheet_plus_set_sheet_data";
  const toolDescription = "Sets data to a specific sheet";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusSetSheetDataTool",
    toolName: toolName,
    module: "ObsidianSheetPlusSetSheetDataRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.tool(
        toolName,
        toolDescription,
        ObsidianSheetPlusSetSheetDataInputSchema.shape,
        async (params) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusSetSheetDataRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await setSheetData(obsidianSheetPlusService, params as SetSheetDataParams, logger, handlerContext);
              logger.debug(`'${toolName}' processed successfully`, handlerContext);

              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(response, null, 2),
                  },
                ],
                isError: false,
              };
            },
            {
              operation: `processing ${toolName} handler`,
              context: handlerContext,
              input: params,
              errorMapper: (error: unknown) =>
                new McpError(
                  error instanceof McpError
                    ? error.code
                    : BaseErrorCode.INTERNAL_ERROR,
                  `Error processing ${toolName} tool: ${error instanceof Error ? error.message : "Unknown error"}`,
                  { ...handlerContext },
                ),
            },
          );
        },
      );

      logger.info(`Tool registered successfully: ${toolName}`, registrationContext);
    },
    {
      operation: `registering tool ${toolName}`,
      context: registrationContext,
      errorCode: BaseErrorCode.INTERNAL_ERROR,
      errorMapper: (error: unknown) =>
        new McpError(
          error instanceof McpError ? error.code : BaseErrorCode.INTERNAL_ERROR,
          `Failed to register tool '${toolName}': ${error instanceof Error ? error.message : "Unknown error"}`,
          { ...registrationContext },
        ),
      critical: true,
    },
  );
}
