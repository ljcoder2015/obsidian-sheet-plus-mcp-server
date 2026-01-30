/**
 * @module ObsidianSheetPlusSetSheetDataTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Sheet Data tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusSetSheetDataTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Set Sheet Data tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusSetSheetDataToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusSetSheetDataTool(server, obsidianSheetPlusService);
}
