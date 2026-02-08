/**
 * @module ObsidianSheetPlusInsertRowsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Insert Rows tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusInsertRowsTool } from "./registration.js";

export async function registerObsidianSheetPlusInsertRowsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusInsertRowsTool(server, obsidianSheetPlusService);
}
