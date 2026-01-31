/**
 * @module ObsidianSheetPlusSetRangeStyleTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Set Range Style tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusSetRangeStyleTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Set Range Style tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusSetRangeStyleToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusSetRangeStyleTool(server, obsidianSheetPlusService);
}
