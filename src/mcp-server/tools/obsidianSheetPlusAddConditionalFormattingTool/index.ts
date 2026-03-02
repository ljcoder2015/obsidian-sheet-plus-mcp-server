/**
 * @module ObsidianSheetPlusAddConditionalFormattingTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Add Conditional Formatting tool with the MCP server.
 */

import { registerObsidianSheetPlusAddConditionalFormattingTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Add Conditional Formatting tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusAddConditionalFormattingToolHandler(server: any, obsidianSheetPlusService: any): Promise<void> {
  await registerObsidianSheetPlusAddConditionalFormattingTool(server, obsidianSheetPlusService);
}
