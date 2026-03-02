/**
 * @module ObsidianSheetPlusSetFilterCriteriaTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Filter Criteria tool with the MCP server.
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
import { setFilterCriteria } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusSetFilterCriteriaInputSchema = z.object({
  sheetName: z.string().optional().describe("The name of the sheet (optional, defaults to active sheet)"),
  range: z.string().describe("Range with existing filter, e.g., A1:D10"),
  criteria: z.object({
    column: z.string().describe("Column letter to set filter on, e.g., 'A'"),
    type: z.string().describe("Filter type: 'equals', 'contains', 'greaterThan', 'lessThan', 'between', 'notBlank', 'blank'"),
    values: z.array(z.any()).optional().describe("Filter values based on type: ['value'] for equals, ['min', 'max'] for between"),
  }).describe("Filter criteria object"),
});

export async function registerObsidianSheetPlusSetFilterCriteriaTool(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  const toolName = "set_filter_criteria";
  const toolDescription = "Set filter criteria for an existing filter range.";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusSetFilterCriteriaTool",
    toolName: toolName,
    module: "ObsidianSheetPlusSetFilterCriteriaRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.registerTool(
        toolName,
        {
          description: toolDescription,
          inputSchema: ObsidianSheetPlusSetFilterCriteriaInputSchema.shape as any,
        },
        async (params: z.infer<typeof ObsidianSheetPlusSetFilterCriteriaInputSchema>) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusSetFilterCriteriaRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await setFilterCriteria(obsidianSheetPlusService, params.sheetName, params.range, params.criteria, logger, handlerContext);
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
