/**
 * @module ObsidianSheetPlusDeleteColumnsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Delete Columns tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusDeleteColumnsTool } from "./registration.js";

export async function registerObsidianSheetPlusDeleteColumnsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusDeleteColumnsTool(server, obsidianSheetPlusService);
}
