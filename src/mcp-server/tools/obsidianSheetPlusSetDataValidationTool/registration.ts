/**
 * @module ObsidianSheetPlusSetDataValidationTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Data Validation tool with the MCP server.
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
import { setDataValidation } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusSetDataValidationInputSchema = z.object({
  sheetName: z.string().optional().describe("The name of the sheet to set data validation on"),
  range: z.string().describe("The cell range to set data validation on, e.g., A1:B10"),
  type: z.string().describe("The type of data validation, e.g., whole, decimal, list, date, time, textLength, custom, checkbox or any").optional(),
  formula1: z.string().describe("The first formula or value, e.g., 1 or A1:A10").optional(),
  formula2: z.string().optional().describe("The second formula or value, used for between type, e.g., 100"),
  operator: z.string().optional().describe("The operator, e.g., between, equal, greaterThan, etc."),
  allowBlank: z.boolean().optional().describe("Whether to allow blank values"),
  showErrorMessage: z.boolean().optional().describe("Whether to show error messages"),
  errorMessage: z.string().optional().describe("The error message to display"),
});

export async function registerObsidianSheetPlusSetDataValidationToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {

  const toolName = "set_data_validation";
  const toolDescription = "Sets data validation for a range of cells";

  const registrationContext: RequestContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusSetDataValidationTool",
    toolName: toolName,
    module: "ObsidianSheetPlusSetDataValidationRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(
    async () => {
      server.registerTool(
        toolName,
        {
          description: toolDescription,
          inputSchema: ObsidianSheetPlusSetDataValidationInputSchema.shape as any,
        },
        async (params: any) => {
          const handlerContext: RequestContext = requestContextService.createRequestContext({
            parentContext: registrationContext,
            operation: "HandleObsidianSheetPlusSetDataValidationRequest",
            toolName: toolName,
            params: params,
          });
          logger.debug(`Handling '${toolName}' request`, handlerContext);

          return await ErrorHandler.tryCatch(
            async () => {
              const response = await setDataValidation(obsidianSheetPlusService, params as any, logger, handlerContext);
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
