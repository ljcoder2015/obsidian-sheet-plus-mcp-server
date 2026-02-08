/**
 * @module ObsidianSheetPlusAutoResizeRowsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Auto Resize Rows tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusAutoResizeRowsTool } from "./registration.js";

export async function registerObsidianSheetPlusAutoResizeRowsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusAutoResizeRowsTool(server, obsidianSheetPlusService);
}
