/**
 * @module ObsidianSheetPlusGetMaxRowsTool Registration
 * @description
 * Registers the Obsidian Sheet Plus Get Max Rows tool with the MCP server.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ObsidianSheetPlusRestApiService } from "../../../services/obsidianSheetPlusRestAPI/index.js";
import { registerObsidianSheetPlusGetMaxRowsTool } from "./registration.js";

export async function registerObsidianSheetPlusGetMaxRowsToolHandler(
  server: McpServer,
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void> {
  await registerObsidianSheetPlusGetMaxRowsTool(server, obsidianSheetPlusService);
}
