/**
 * @module ObsidianSheetPlusAddConditionalFormattingTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Add Conditional Formatting tool with the MCP server.
 */

import { BaseErrorCode, McpError } from "../../../types-global/errors.js";
import { ErrorHandler, logger, requestContextService, } from "../../../utils/index.js";
import { z } from "zod";
import { addConditionalFormatting } from "./logic.js";

// Define input schema using Zod
const ObsidianSheetPlusAddConditionalFormattingInputSchema = z.object({
  sheetName: z.string().optional().describe("The name of the sheet (optional, defaults to active sheet)"),
  range: z.string().describe("Cell range, e.g., A1:B10"),
  ruleType: z.enum([
    "number",
    "text",
    "date",
    "cell",
    "average",
    "colorScale",
    "dataBar",
    "iconSet"
  ]).describe("Type of conditional formatting rule"),
  condition: z.any().describe("Condition settings based on rule type: - number: { operator: string, value: number } - text: { textOperator: string, text: string } - date: { dateOperator: string } - cell: { cellType: string } - average: { averageOperator: string } - colorScale: { colorScale: [{ index: number, color: string, value: { type: string, value: number } }] } - dataBar: { min: { type: string, value: number }, max: { type: string, value: number }, positiveColor: string, nativeColor: string, isShowValue: boolean, isGradient: boolean } - iconSet: { iconConfigs: [{ iconType: string (available types: 3Arrows, 3ArrowsGray, 4Arrows, 4ArrowsGray, 5Arrows, 5ArrowsGray, 3Triangles, 3TrafficLights1, 3Signs, 3TrafficLights2, 4RedToBlack, 4TrafficLights, 3Symbols, 3Symbols2, 3Flags, 4Rating, 5Rating, 5Quarters, _5Felling, 5Boxes, 3Stars), iconId: string, operator: string, value: { type: string, value: number } }], isShowValue: boolean }"),
  format: z.any().optional().describe("Format settings for conditional formatting: { backgroundColor: string, fontColor: string, bold: boolean, italic: boolean, underline: boolean }"),
});

export async function registerObsidianSheetPlusAddConditionalFormattingTool(
  server: any,
  obsidianSheetPlusService: any,
): Promise<void> {
  const toolName = "add_conditional_formatting";
  const toolDescription = "Add conditional formatting rule to a range";

  const registrationContext = requestContextService.createRequestContext({
    operation: "RegisterObsidianSheetPlusAddConditionalFormattingTool",
    toolName: toolName,
    module: "ObsidianSheetPlusAddConditionalFormattingRegistration",
  });

  logger.info(`Attempting to register tool: ${toolName}`, registrationContext);

  await ErrorHandler.tryCatch(async () => {
    server.registerTool(
      toolName,
      {
        description: toolDescription,
        inputSchema: ObsidianSheetPlusAddConditionalFormattingInputSchema.shape as any,
      },
      async (params: z.infer<typeof ObsidianSheetPlusAddConditionalFormattingInputSchema>) => {
        const handlerContext = requestContextService.createRequestContext({
          parentContext: registrationContext,
          operation: "HandleObsidianSheetPlusAddConditionalFormattingRequest",
          toolName: toolName,
          params: params,
        });

        logger.debug(`Handling '${toolName}' request`, handlerContext);

        return await ErrorHandler.tryCatch(async () => {
          const response = await addConditionalFormatting(
            obsidianSheetPlusService,
            params.sheetName,
            params.range,
            params.ruleType,
            params.condition,
            params.format,
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
