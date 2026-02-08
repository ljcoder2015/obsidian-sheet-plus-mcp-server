/**
 * @module ObsidianSheetPlusMergeCellsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Merge Cells tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusMergeCellsTool } from "./registration.js";

export async function registerObsidianSheetPlusMergeCellsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusMergeCellsTool(server, obsidianSheetPlusService);
}
