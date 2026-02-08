/**
 * @module ObsidianSheetPlusInsertColumnsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Insert Columns tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusInsertColumnsTool } from "./registration.js";

export async function registerObsidianSheetPlusInsertColumnsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusInsertColumnsTool(server, obsidianSheetPlusService);
}
