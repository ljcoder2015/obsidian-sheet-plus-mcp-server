/**
 * @module ObsidianSheetPlusCreateSheetTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Create Sheet tool with the MCP server.
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
import { createSheet } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusCreateSheetInputSchema = z.object({
  sheetName: z.string().describe("The name of the new sheet")
});

export async function registerObsidianSheetPlusCreateSheetTool(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  const toolName = "create_sheet";
  const toolDescription = "Creates a new sheet in the workbook";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusCreateSheetTool",
    toolName: toolName,
    module: "ObsidianSheetPlusCreateSheetRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.tool(
        toolName,
        toolDescription,
        ObsidianSheetPlusCreateSheetInputSchema.shape as any,
        async (params: any) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusCreateSheetRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await createSheet(obsidianSheetPlusService, logger, handlerContext, params);
              logger.debug(`'${toolName}' processed successfully`, handlerContext);

              return {
                content: [
                  {
                    type: "text" as const,
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
