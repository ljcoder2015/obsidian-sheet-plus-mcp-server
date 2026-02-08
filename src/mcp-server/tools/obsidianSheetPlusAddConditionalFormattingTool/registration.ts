/**
 * @module ObsidianSheetPlusAddConditionalFormattingTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Add Conditional Formatting tool with the MCP server.
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
import { addConditionalFormatting } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusAddConditionalFormattingInputSchema = z.object({
  sheetName: z.string().optional().describe("The name of the sheet to add conditional formatting to"),
  range: z.string().describe("The cell range to add conditional formatting to, e.g., A1:B10"),
  ruleType: z.enum(['number', 'text', 'date', 'cell', 'average', 'colorScale', 'dataBar', 'iconSet']).describe("Type of conditional formatting rule"),
  condition: z.record(z.any()).describe("Condition settings based on rule type"),
  format: z.record(z.any()).optional().describe("Format settings for conditional formatting"),
});

export async function registerObsidianSheetPlusAddConditionalFormattingToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {

  const toolName = "add_conditional_formatting";
  const toolDescription = "Add conditional formatting rule to a range";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusAddConditionalFormattingTool",
    toolName: toolName,
    module: "ObsidianSheetPlusAddConditionalFormattingRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.tool(
        toolName,
        toolDescription,
        ObsidianSheetPlusAddConditionalFormattingInputSchema.shape as any,
        async (params: any) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusAddConditionalFormattingRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await addConditionalFormatting(obsidianSheetPlusService, params, logger, handlerContext);
              logger.debug(`'${toolName}' processed successfully`, handlerContext);

              return {
                content: [
                  {
                    type: "text" as const,
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
