/**
 * @module ObsidianSheetPlusGetFilterTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Get Filter tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusGetFilterTool } from "./registration.js";

/**
 * Registers the Obsidian Sheet Plus Get Filter tool with the MCP server.
 * @param server - The MCP server instance to register the tool with.
 * @param obsidianSheetPlusService - The Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<void>} A promise that resolves when the tool is registered.
 */
export async function registerObsidianSheetPlusGetFilterToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusGetFilterTool(server, obsidianSheetPlusService);
}

