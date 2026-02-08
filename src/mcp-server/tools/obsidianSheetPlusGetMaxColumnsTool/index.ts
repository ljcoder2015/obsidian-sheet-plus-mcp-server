/**
 * @module ObsidianSheetPlusGetMaxColumnsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Get Max Columns tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusGetMaxColumnsTool } from "./registration.js";

export async function registerObsidianSheetPlusGetMaxColumnsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusGetMaxColumnsTool(server, obsidianSheetPlusService);
}
