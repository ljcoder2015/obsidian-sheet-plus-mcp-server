/**
 * @module ObsidianSheetPlusDeleteRowsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Delete Rows tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusDeleteRowsTool } from "./registration.js";

export async function registerObsidianSheetPlusDeleteRowsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusDeleteRowsTool(server, obsidianSheetPlusService);
}
