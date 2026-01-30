/**
 * @module ObsidianSheetPlusGetSheetDataTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Get Sheet Data tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusGetSheetDataTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Get Sheet Data tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusGetSheetDataToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusGetSheetDataTool(server, obsidianSheetPlusService);
}
