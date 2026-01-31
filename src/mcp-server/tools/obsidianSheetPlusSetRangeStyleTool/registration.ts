/**
 * @module ObsidianSheetPlusSetRangeStyleTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Range Style tool with the MCP server.
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
import { setRangeStyle } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusSetRangeStyleInputSchema = z.object({
  sheetName: z.string().describe("The name of the sheet"),
  startRow: z.number().int().describe("The starting row index (0-based)"),
  startColumn: z.number().int().describe("The starting column index (0-based)"),
  endRow: z.number().int().describe("The ending row index (0-based)"),
  endColumn: z.number().int().describe("The ending column index (0-based)"),
  style: z.object({
    bold: z.boolean().optional().describe("Whether to set bold text"),
    italic: z.boolean().optional().describe("Whether to set italic text"),
    underline: z.boolean().optional().describe("Whether to set underline text"),
    fontSize: z.number().optional().describe("The font size"),
    fontFamily: z.string().optional().describe("The font family"),
    color: z.string().optional().describe("The text color (hex format)"),
    backgroundColor: z.string().optional().describe("The background color (hex format)"),
    horizontalAlignment: z.enum(["left", "center", "right"]).optional().describe("Horizontal alignment"),
    verticalAlignment: z.enum(["top", "center", "bottom"]).optional().describe("Vertical alignment"),
  }).describe("The style object"),
});

export async function registerObsidianSheetPlusSetRangeStyleTool(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  const toolName = "obsidian_sheet_plus_set_range_style";
  const toolDescription = "Sets style for a range of cells";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusSetRangeStyleTool",
    toolName: toolName,
    module: "ObsidianSheetPlusSetRangeStyleRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.tool(
        toolName,
        toolDescription,
        ObsidianSheetPlusSetRangeStyleInputSchema.shape,
        async (params) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusSetRangeStyleRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await setRangeStyle(obsidianSheetPlusService, logger, handlerContext, params);
              logger.debug(`'${toolName}' processed successfully`, handlerContext);

              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(response, null, 2),
                  },
                ],
                isError: !response.success,
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
