/**
 * @module ObsidianSheetPlusSetFormulaTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Formula tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusSetFormulaTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Set Formula tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusSetFormulaToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusSetFormulaTool(server, obsidianSheetPlusService);
}
