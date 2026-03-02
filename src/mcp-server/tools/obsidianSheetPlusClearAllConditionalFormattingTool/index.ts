/**
 * @module ObsidianSheetPlusClearAllConditionalFormattingTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Clear All Conditional Formatting tool with the MCP server.
 */

import { registerObsidianSheetPlusClearAllConditionalFormattingTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Clear All Conditional Formatting tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusClearAllConditionalFormattingToolHandler(server: any, obsidianSheetPlusService: any): Promise<void> {
  await registerObsidianSheetPlusClearAllConditionalFormattingTool(server, obsidianSheetPlusService);
}
