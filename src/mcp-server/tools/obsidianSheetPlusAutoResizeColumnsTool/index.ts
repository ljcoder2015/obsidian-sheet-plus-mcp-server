/**
 * @module ObsidianSheetPlusAutoResizeColumnsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Auto Resize Columns tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusAutoResizeColumnsTool } from "./registration.js";

export async function registerObsidianSheetPlusAutoResizeColumnsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusAutoResizeColumnsTool(server, obsidianSheetPlusService);
}
