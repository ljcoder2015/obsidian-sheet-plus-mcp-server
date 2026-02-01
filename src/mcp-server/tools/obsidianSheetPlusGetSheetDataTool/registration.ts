/**
 * @module ObsidianSheetPlusGetSheetDataTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Get Sheet Data tool with the MCP server.
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
import { getSheetData } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusGetSheetDataInputSchema = z.object({
  sheetName: z.string().optional().describe("The name of the sheet to get data from (optional, defaults to active sheet)"),
  range: z.string().optional().describe("The range of cells to get data from"),
});

export async function registerObsidianSheetPlusGetSheetDataTool(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  const toolName = "get_sheet_data";
  const toolDescription = "Gets data from a specific sheet";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusGetSheetDataTool",
    toolName: toolName,
    module: "ObsidianSheetPlusGetSheetDataRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.tool(
        toolName,
        toolDescription,
        ObsidianSheetPlusGetSheetDataInputSchema.shape,
        async (params) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusGetSheetDataRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await getSheetData(obsidianSheetPlusService, params.sheetName, params.range, logger, handlerContext);
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
