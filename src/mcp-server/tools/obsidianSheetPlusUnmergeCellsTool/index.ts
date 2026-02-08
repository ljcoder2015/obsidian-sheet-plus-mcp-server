/**
 * @module ObsidianSheetPlusUnmergeCellsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Unmerge Cells tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusUnmergeCellsTool } from "./registration.js";

export async function registerObsidianSheetPlusUnmergeCellsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusUnmergeCellsTool(server, obsidianSheetPlusService);
}
