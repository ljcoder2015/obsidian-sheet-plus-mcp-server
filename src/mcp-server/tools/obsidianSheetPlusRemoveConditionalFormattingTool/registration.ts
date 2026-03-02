/**
 * @module ObsidianSheetPlusRemoveConditionalFormattingTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Remove Conditional Formatting tool with the MCP server.
 */

import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { ErrorHandler, logger, requestContextService, } from "../../../utils/index.js";
import { z } from "zod";
import { removeConditionalFormatting } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusRemoveConditionalFormattingInputSchema = z.object({
  sheetName: z.string().optional().describe("The name of the sheet (optional, defaults to active sheet)"),
  range: z.string().describe("Cell range, e.g., A1:B10"),
});

export async function registerObsidianSheetPlusRemoveConditionalFormattingTool(
  server: any,
  obsidianSheetPlusService: any,
): Promise<void> {
  const toolName = "remove_conditional_formatting";
  const toolDescription = "Remove conditional formatting rules from a range";

  const registrationContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusRemoveConditionalFormattingTool",
    toolName: toolName,
    module: "ObsidianSheetPlusRemoveConditionalFormattingRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(async () => {
    server.registerTool(
      toolName,
      {
        description: toolDescription,
        inputSchema: ObsidianSheetPlusRemoveConditionalFormattingInputSchema.shape as any,
      },
      async (params: z.infer<typeof ObsidianSheetPlusRemoveConditionalFormattingInputSchema>) => {
        const handlerContext = requestContextService.createRequestContext({
          parentContext: registrationContext,
          operation: "HandleObsidianSheetPlusRemoveConditionalFormattingRequest",
          toolName: toolName,
          params: params,
        });

        logger.debug(`Handling '${toolName}' request`, handlerContext);

        return await ErrorHandler.tryCatch(async () => {
          const response = await removeConditionalFormatting(
            obsidianSheetPlusService,
            params.sheetName,
            params.range,
            logger,
            handlerContext
          );

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
        }, {
          operation: `processing ${toolName} handler`,
          context: handlerContext,
          input: params,
          errorMapper: (error) => new McpError(
            error instanceof McpError
              ? error.code
              : BaseErrorCode.INTERNAL_ERROR,
            `Error processing ${toolName} tool: ${error instanceof Error ? error.message : "Unknown error"}`,
            { ...handlerContext }
          ),
        });
      }
    );

    logger.info(`Tool registered successfully: ${toolName}`, registrationContext);
  }, {
    operation: `registering tool ${toolName}`,
    context: registrationContext,
    errorCode: BaseErrorCode.INTERNAL_ERROR,
    errorMapper: (error) => new McpError(
      error instanceof McpError ? error.code : BaseErrorCode.INTERNAL_ERROR,
      `Failed to register tool '${toolName}': ${error instanceof Error ? error.message : "Unknown error"}`,
      { ...registrationContext }
    ),
    critical: true,
  });
}
