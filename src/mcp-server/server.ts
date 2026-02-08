/**
 * @fileoverview Main entry point for the MCP (Model Context Protocol) server.
 * This file orchestrates the server's lifecycle:
 * 1. Initializes the core `McpServer` instance (from `@modelcontextprotocol/sdk`) with its identity and capabilities.
 * 2. Registers available resources and tools, making them discoverable and usable by clients.
 * 3. Selects and starts the appropriate communication transport (stdio or Streamable HTTP)
 *    based on configuration.
 * 4. Handles top-level error management during startup.
 *
 * MCP Specification References:
 * - Lifecycle: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/lifecycle.mdx
 * - Overview (Capabilities): https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/index.mdx
 * - Transports: https://github.com/modelcontextprotocol/modelcontextprotocol/blob/main/docs/specification/2025-03-26/basic/transports.mdx
 * @module src/mcp-server/server
 */

import { ServerType } from "@hono/node-server";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
// Import validated configuration and environment details.
import { config, environment } from "../config/index.js";
// Import core utilities: ErrorHandler, logger, requestContextService.
import { ErrorHandler, logger, requestContextService } from "../utils/index.js";
// Import the Obsidian Sheet Plus service
import { ObsidianSheetPlusRestApiService } from "../services/obsidianSheetPlusRestAPI/index.js";
// Import Obsidian Sheet Plus tools
import { registerObsidianSheetPlusGetSheetListToolHandler } from "./tools/obsidianSheetPlusGetSheetListTool/index.js";
import { registerObsidianSheetPlusGetSheetDataToolHandler } from "./tools/obsidianSheetPlusGetSheetDataTool/index.js";
import { registerObsidianSheetPlusSetSheetDataToolHandler } from "./tools/obsidianSheetPlusSetSheetDataTool/index.js";
import { registerObsidianSheetPlusGetWorkbookDataToolHandler } from "./tools/obsidianSheetPlusGetWorkbookDataTool/index.js";
import { registerObsidianSheetPlusSetDataValidationToolHandler } from "./tools/obsidianSheetPlusSetDataValidationTool/index.js";
import { registerObsidianSheetPlusCreateSheetToolHandler } from "./tools/obsidianSheetPlusCreateSheetTool/index.js";
import { registerObsidianSheetPlusSetFormulaToolHandler } from "./tools/obsidianSheetPlusSetFormulaTool/index.js";
import { registerObsidianSheetPlusSetRangeStyleToolHandler } from "./tools/obsidianSheetPlusSetRangeStyleTool/index.js";
import { registerObsidianSheetPlusClearContentsToolHandler } from "./tools/obsidianSheetPlusClearContentsTool/index.js";
import { registerObsidianSheetPlusClearFormatToolHandler } from "./tools/obsidianSheetPlusClearFormatTool/index.js";
import { registerObsidianSheetPlusClearAllToolHandler } from "./tools/obsidianSheetPlusClearAllTool/index.js";
import { registerObsidianSheetPlusClearDataValidationToolHandler } from "./tools/obsidianSheetPlusClearDataValidationTool/index.js";
import { registerObsidianSheetPlusAddConditionalFormattingToolHandler } from "./tools/obsidianSheetPlusAddConditionalFormattingTool/index.js";
import { registerObsidianSheetPlusRemoveConditionalFormattingToolHandler } from "./tools/obsidianSheetPlusRemoveConditionalFormattingTool/index.js";
import { registerObsidianSheetPlusClearAllConditionalFormattingToolHandler } from "./tools/obsidianSheetPlusClearAllConditionalFormattingTool/index.js";
import { registerObsidianSheetPlusCheckStatusToolHandler } from "./tools/obsidianSheetPlusCheckStatusTool/index.js";
import { registerObsidianSheetPlusInsertRowsToolHandler } from "./tools/obsidianSheetPlusInsertRowsTool/index.js";
import { registerObsidianSheetPlusDeleteRowsToolHandler } from "./tools/obsidianSheetPlusDeleteRowsTool/index.js";
import { registerObsidianSheetPlusInsertColumnsToolHandler } from "./tools/obsidianSheetPlusInsertColumnsTool/index.js";
import { registerObsidianSheetPlusDeleteColumnsToolHandler } from "./tools/obsidianSheetPlusDeleteColumnsTool/index.js";
import { registerObsidianSheetPlusAutoResizeRowsToolHandler } from "./tools/obsidianSheetPlusAutoResizeRowsTool/index.js";
import { registerObsidianSheetPlusAutoResizeColumnsToolHandler } from "./tools/obsidianSheetPlusAutoResizeColumnsTool/index.js";
import { registerObsidianSheetPlusGetMaxRowsToolHandler } from "./tools/obsidianSheetPlusGetMaxRowsTool/index.js";
import { registerObsidianSheetPlusGetMaxColumnsToolHandler } from "./tools/obsidianSheetPlusGetMaxColumnsTool/index.js";
import { registerObsidianSheetPlusMergeCellsToolHandler } from "./tools/obsidianSheetPlusMergeCellsTool/index.js";
import { registerObsidianSheetPlusUnmergeCellsToolHandler } from "./tools/obsidianSheetPlusUnmergeCellsTool/index.js";
// Import transport setup functions.
import { startHttpTransport } from "./transports/httpTransport.js";
import { connectStdioTransport } from "./transports/stdioTransport.js";

/**
 * Creates and configures a new instance of the `McpServer`.
 *
 * This function is central to defining the server's identity and functionality
 * as presented to connecting clients during the MCP initialization phase.
 * It uses pre-instantiated shared services like Obsidian Sheet Plus API.
 *
 * MCP Spec Relevance:
 * - Server Identity (`serverInfo`): The `name` and `version` provided here are part
 *   of the `ServerInformation` object returned in the `InitializeResult` message.
 * - Capabilities Declaration: Declares supported features (logging, dynamic resources/tools).
 * - Resource/Tool Registration: Calls registration functions, passing necessary service instances.
 *
 * Design Note: This factory is called once for 'stdio' transport and per session for 'http' transport.
 *
 * @param {ObsidianSheetPlusRestApiService} obsidianSheetPlusService - The shared Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<McpServer>} A promise resolving with the configured `McpServer` instance.
 * @throws {Error} If any resource or tool registration fails.
 * @private
 */
async function createMcpServerInstance(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<McpServer> {
  const context = requestContextService.createRequestContext({
    operation: "createMcpServerInstance",
  });
  logger.info("Initializing MCP server instance with shared services", context);

  requestContextService.configure({
    appName: config.mcpServerName,
    appVersion: config.mcpServerVersion,
    environment,
  });

  logger.debug("Instantiating McpServer with capabilities", {
    ...context,
    serverInfo: {
      name: config.mcpServerName,
      version: config.mcpServerVersion,
    },
    capabilities: {
      logging: {},
      resources: { listChanged: true },
      tools: { listChanged: true },
    },
  });
  const server = new McpServer(
    { name: config.mcpServerName, version: config.mcpServerVersion },
    {
      capabilities: {
        logging: {}, // Server can receive logging/setLevel and send notifications/message
        resources: { listChanged: true }, // Server supports dynamic resource lists
        tools: { listChanged: true }, // Server supports dynamic tool lists
      },
    },
  );

  try {
    logger.debug(
      "Registering resources and tools using shared services...",
      context,
    );
    
    // Register Obsidian Sheet Plus tools
    logger.debug("Registering Obsidian Sheet Plus tools...", context);
    await registerObsidianSheetPlusGetSheetListToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusGetSheetDataToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusSetSheetDataToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusGetWorkbookDataToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusSetDataValidationToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusCreateSheetToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusSetFormulaToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusSetRangeStyleToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusClearContentsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusClearFormatToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusClearAllToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusClearDataValidationToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusAddConditionalFormattingToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusRemoveConditionalFormattingToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusClearAllConditionalFormattingToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusCheckStatusToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusInsertRowsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusDeleteRowsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusInsertColumnsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusDeleteColumnsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusAutoResizeRowsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusAutoResizeColumnsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusGetMaxRowsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusGetMaxColumnsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusMergeCellsToolHandler(server, obsidianSheetPlusService);
    await registerObsidianSheetPlusUnmergeCellsToolHandler(server, obsidianSheetPlusService);
    logger.debug("Obsidian Sheet Plus tools registered successfully", context);

    logger.info("Resources and tools registered successfully", context);
  } catch (err) {
    logger.error("Failed to register resources/tools", {
      ...context,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw err; // Re-throw to be caught by the caller (e.g., startTransport)
  }

  return server;
}

/**
 * Selects, sets up, and starts the appropriate MCP transport layer based on configuration.
 * This function acts as the bridge between the core server logic and the communication channel.
 * It now accepts shared service instances to pass them down the chain.
 *
 * MCP Spec Relevance:
 * - Transport Selection: Uses `config.mcpTransportType` ('stdio' or 'http').
 * - Transport Connection: Calls dedicated functions for chosen transport.
 * - Server Instance Lifecycle: Single instance for 'stdio', per-session for 'http'.
 *
 * @param {ObsidianSheetPlusRestApiService} obsidianSheetPlusService - The shared Obsidian Sheet Plus REST API service instance.
 * @returns {Promise<McpServer | void>} Resolves with the `McpServer` instance for 'stdio', or `void` for 'http'.
 * @throws {Error} If the configured transport type is unsupported or if transport setup fails.
 * @private
 */
async function startTransport(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<McpServer | ServerType | void> {
  const transportType = config.mcpTransportType;
  const context = requestContextService.createRequestContext({
    operation: "startTransport",
    transport: transportType,
  });
  logger.info(`Starting transport: ${transportType}`, context);

  if (transportType === "http") {
    logger.debug(
      "Delegating to startHttpTransport with a factory for McpServer instances...",
      context,
    );
    // For HTTP, startHttpTransport manages its own lifecycle and server instances per session.
          // It needs a factory function to create new McpServer instances, passing along the shared services.
          const mcpServerFactory = async () =>
            createMcpServerInstance(obsidianSheetPlusService);
          const httpServerInstance = await startHttpTransport(
            mcpServerFactory,
            context,
          );
    return httpServerInstance; // Return the http.Server instance.
  }

  if (transportType === "stdio") {
    logger.debug(
      "Creating single McpServer instance for stdio transport using shared services...",
      context,
    );
    const server = await createMcpServerInstance(
      obsidianSheetPlusService,
    );
    logger.debug("Delegating to connectStdioTransport...", context);
    await connectStdioTransport(server, context);
    return server; // Return the single server instance for stdio.
  }

  // Should not be reached if config validation is effective.
  logger.fatal(
    `Unsupported transport type configured: ${transportType}`,
    context,
  );
  throw new Error(
    `Unsupported transport type: ${transportType}. Must be 'stdio' or 'http'.`,
  );
}

/**
 * Main application entry point. Initializes services and starts the MCP server.
 * Orchestrates server startup, transport selection, and top-level error handling.
 *
 * MCP Spec Relevance:
 * - Manages server startup, leading to a server ready for MCP messages.
 * - Handles critical startup failures, ensuring appropriate process exit.
 *
 * @param {ObsidianSheetPlusRestApiService} obsidianSheetPlusService - The shared Obsidian Sheet Plus REST API service instance, instantiated by the caller (e.g., index.ts).
 * @returns {Promise<void | McpServer>} For 'stdio', resolves with `McpServer`. For 'http', runs indefinitely.
 *   Rejects on critical failure, leading to process exit.
 */
export async function initializeAndStartServer(
  obsidianSheetPlusService: ObsidianSheetPlusRestApiService,
): Promise<void | McpServer | ServerType> {
  const context = requestContextService.createRequestContext({
    operation: "initializeAndStartServer",
  });
  logger.info(
    "MCP Server initialization sequence started (services provided).",
    context,
  );

  try {
    // Services are now provided by the caller (e.g., index.ts)
    logger.debug(
      "Using provided shared services (ObsidianSheetPlusRestApiService).",
      context,
    );

    // Initiate the transport setup based on configuration, passing shared services.
    const result = await startTransport(obsidianSheetPlusService);
    logger.info(
      "MCP Server initialization sequence completed successfully.",
      context,
    );
    return result;
  } catch (err) {
    logger.fatal("Critical error during MCP server initialization.", {
      ...context,
      error: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    // Ensure the error is handled by our centralized handler, which might log more details or perform cleanup.
    ErrorHandler.handleError(err, {
      operation: "initializeAndStartServer", // More specific operation
      context: context, // Pass the existing context
      critical: true, // This is a critical failure
    });
    logger.info(
      "Exiting process due to critical initialization error.",
      context,
    );
    process.exit(1); // Exit with a non-zero code to indicate failure.
  }
}
