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
  sheetName: z.string().optional().describe("The name of the sheet"),
  range: z.string().describe("The range of cells to style (e.g., 'A1:B2')"),
  style: z.object({
    backgroundColor: z.string().optional().describe("The background color (hex format)"),
    fontColor: z.string().optional().describe("The font color (hex format)"),
    fontSize: z.number().optional().describe("The font size"),
    fontFamily: z.string().optional().describe("The font family"),
    bold: z.boolean().optional().describe("Whether to set bold text"),
    fontLine: z.enum(["none","single", "double"]).optional().describe("The font line style"),
    fontWeight: z.enum(["normal", "bold"]).optional().describe("The font weight"),
    fontStyle: z.enum(["normal", "italic"]).optional().describe("The font style"),
    textDecoration: z.enum(["none", "underline", "line-through"]).optional().describe("The text decoration"),
    horizontalAlignment: z.enum(["left", "center", "right"]).optional().describe("Horizontal alignment"),
    verticalAlignment: z.enum(["top", "center", "bottom"]).optional().describe("Vertical alignment"),
    textRotation: z.number().optional().describe("The text rotation angle"),
    wrap: z.boolean().optional().describe("The wrap strategy"),
    border: z.object({
      type: z.enum(['top', 'bottom', 'left', 'right', 'none', 'all', 'outside', 'inside', 'horizontal', 'vertical', 'tlbr', 'tlbc_tlmr', 'tlbr_tlbc_tlmr', 'bl_tr', 'mltr_bctr']).optional().describe("The border type"),
      style: z.enum(['NONE', 'THIN', 'HAIR', 'DOTTED', 'DASHED', 'DASH_DOT', 'DASH_DOT_DOT', 'DOUBLE',
                  'MEDIUM',
                  'MEDIUM_DASHED',
                  'MEDIUM_DASH_DOT',
                  'MEDIUM_DASH_DOT_DOT',
                  'SLANT_DASH_DOT',
                  'THICK',]).optional().describe("The border style"),
      color: z.string().optional().describe("The border color (hex format)"),
    }).optional().describe("The border object"),
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
