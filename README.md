# Obsidian Sheet Plus MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-^5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP%20SDK-^1.13.0-green.svg)](https://modelcontextprotocol.io/)
[![Version](https://img.shields.io/badge/Version-2.0.7-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen.svg)](https://github.com/cyanheads/obsidian-sheet-plus-mcp-server/issues)
[![GitHub](https://img.shields.io/github/stars/cyanheads/obsidian-sheet-plus-mcp-server?style=social)](https://github.com/cyanheads/obsidian-sheet-plus-mcp-server)

**Empower your AI agents and development tools with seamless Obsidian Sheet Plus integration!**

An MCP (Model Context Protocol) server providing comprehensive access to your Obsidian Sheet Plus data. Enables LLMs and AI agents to read, write, and manage your sheets through the Obsidian Sheet Plus plugin API.

Built on the [`cyanheads/mcp-ts-template`](https://github.com/cyanheads/mcp-ts-template), this server follows a modular architecture with robust error handling, logging, and security features.

## 🚀 Core Capabilities: Obsidian Sheet Plus Tools 🛠️

This server equips your AI with specialized tools to interact with your Obsidian Sheet Plus data:

| Tool Name                                                                                    | Description                                         | Key Features                                                                                |
| :------------------------------------------------------------------------------------------- | :-------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [`obsidian_sheet_plus_get_sheet_list`](./src/mcp-server/tools/obsidianSheetPlusGetSheetListTool/) | Retrieves the list of sheets in the workbook.       | - Returns sheet names and metadata.<br/>- Includes sheet IDs and creation information.      |
| [`obsidian_sheet_plus_get_sheet_data`](./src/mcp-server/tools/obsidianSheetPlusGetSheetDataTool/) | Gets data from a specific sheet.                    | - Returns complete sheet data including cells, rows, and columns.<br/>- Supports structured data formats. |
| [`obsidian_sheet_plus_get_workbook`](./src/mcp-server/tools/obsidianSheetPlusGetWorkbookTool/) | Gets full workbook data including all sheets.       | - Returns comprehensive workbook information.<br/>- Includes all sheets and their data.     |
| [`obsidian_sheet_plus_set_sheet_data`](./src/mcp-server/tools/obsidianSheetPlusSetSheetDataTool/) | Sets data to a specific sheet.                      | - Updates sheet content with new data.<br/>- Supports batch operations for efficiency.       |

---

## Table of Contents

| [Overview](#overview) | [Features](#features) | [Configuration](#configuration) |
| [Project Structure](#project-structure) | [Tools](#tools) | [Resources](#resources) | [Development](#development) | [License](#license) |

## Overview

The Obsidian Sheet Plus MCP Server acts as a bridge, allowing applications (MCP Clients) that understand the Model Context Protocol (MCP) – like advanced AI assistants (LLMs), IDE extensions, or custom scripts – to interact directly and safely with your Obsidian Sheet Plus data.

Instead of complex scripting or manual interaction, your tools can leverage this server to:

- **Automate sheet management**: Read sheet data, update content, and manage your Obsidian Sheet Plus workbooks programmatically.
- **Integrate Obsidian Sheet Plus into AI workflows**: Enable LLMs to access and modify your spreadsheet data as part of their research, analysis, or reporting tasks.
- **Build custom Obsidian Sheet Plus tools**: Create external applications that interact with your sheet data in novel ways.

Built on the robust `mcp-ts-template`, this server provides a standardized, secure, and efficient way to expose Obsidian Sheet Plus functionality via the MCP standard. It achieves this by communicating with the Obsidian Sheet Plus plugin API running inside your Obsidian vault.

> **Developer Note**: This repository includes a [.clinerules](.clinerules) file that serves as a developer cheat sheet for your LLM coding agent with quick reference for the codebase patterns, file locations, and code snippets.

## Features

### Core Utilities

Leverages the robust utilities provided by `cyanheads/mcp-ts-template`:

- **Logging**: Structured, configurable logging (file rotation, console, MCP notifications) with sensitive data redaction.
- **Error Handling**: Centralized error processing, standardized error types (`McpError`), and automatic logging.
- **Configuration**: Environment variable loading (`dotenv`) with comprehensive validation.
- **Input Validation/Sanitization**: Uses `zod` for schema validation and custom sanitization logic.
- **Request Context**: Tracking and correlation of operations via unique request IDs.
- **Type Safety**: Strong typing enforced by TypeScript and Zod schemas.
- **HTTP Transport Option**: Built-in Hono server with SSE, session management, CORS support, and pluggable authentication strategies (JWT and OAuth 2.1).

### Obsidian Sheet Plus Integration

- **Obsidian Sheet Plus API Integration**: Communicates directly with the Obsidian Sheet Plus plugin via HTTP requests managed by the `ObsidianSheetPlusRestApiService`.
- **Comprehensive Command Coverage**: Exposes key sheet operations as MCP tools (see [Tools](#tools) section).
- **Sheet Interaction**: Supports reading sheet lists, retrieving sheet data, getting entire workbooks, and updating sheet content.
- **Safety Features**: Robust error handling, clear error messages, and comprehensive input validation.

## Installation

### Prerequisites

1.  **Obsidian**: You need Obsidian installed.
2.  **Obsidian Sheet Plus Plugin**: Install and enable the Obsidian Sheet Plus plugin within your Obsidian vault.
3.  **API Key**: Configure an API key within the Obsidian Sheet Plus plugin settings in Obsidian. You will need this key to configure the server.
4.  **Node.js & npm**: Ensure you have Node.js (v18 or later recommended) and npm installed.

## Configuration

### MCP Client Settings

Add the following to your MCP client's configuration file (e.g., `cline_mcp_settings.json`). This configuration uses `npx` to run the server, which will automatically download & install the package if not already present:

```json
{
  "mcpServers": {
    "obsidian-sheet-plus-mcp-server": {
      "command": "npx",
      "args": ["obsidian-sheet-plus-mcp-server"],
      "env": {
        "OBSIDIAN_SHEET_PLUS_API_KEY": "YOUR_API_KEY_FROM_OBSIDIAN_SHEET_PLUS_PLUGIN",
        "OBSIDIAN_SHEET_PLUS_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_SHEET_PLUS_VERIFY_SSL": "false"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**Note**: Verify SSL is set to false here because the Obsidian Sheet Plus plugin uses a self-signed certificate by default. If you are deploying this in a production environment, consider using the encrypted HTTPS endpoint and set `OBSIDIAN_SHEET_PLUS_VERIFY_SSL` to `true` after configuring your server to trust the self-signed certificate.

If you installed from source, change `command` and `args` to point to your local build:

```json
{
  "mcpServers": {
    "obsidian-sheet-plus-mcp-server": {
      "command": "node",
      "args": ["/path/to/your/obsidian-sheet-plus-mcp-server/dist/index.js"],
      "env": {
        "OBSIDIAN_SHEET_PLUS_API_KEY": "YOUR_API_KEY_FROM_OBSIDIAN_SHEET_PLUS_PLUGIN",
        "OBSIDIAN_SHEET_PLUS_BASE_URL": "http://127.0.0.1:27123",
        "OBSIDIAN_SHEET_PLUS_VERIFY_SSL": "false"
      }
    }
  }
}
```

### Environment Variables

Configure the server using environment variables. These environmental variables are set within your MCP client config/settings (e.g. `cline_mcp_settings.json` for Cline, `claude_desktop_config.json` for Claude Desktop).

| Variable                                  | Description                                                              | Required             | Default                  |
| :---------------------------------------- | :----------------------------------------------------------------------- | :------------------- | :----------------------- |
| **`OBSIDIAN_SHEET_PLUS_API_KEY`**         | API Key from the Obsidian Sheet Plus plugin.                             | **Yes**              | `undefined`              |
| **`OBSIDIAN_SHEET_PLUS_BASE_URL`**        | Base URL of your Obsidian Sheet Plus plugin API.                         | **Yes**              | `http://127.0.0.1:27123` |
| `MCP_TRANSPORT_TYPE`                      | Server transport: `stdio` or `http`.                                     | No                   | `stdio`                  |
| `MCP_HTTP_PORT`                           | Port for the HTTP server.                                                | No                   | `3010`                   |
| `MCP_HTTP_HOST`                           | Host for the HTTP server.                                                | No                   | `127.0.0.1`              |
| `MCP_ALLOWED_ORIGINS`                     | Comma-separated origins for CORS. **Set for production.**                | No                   | (none)                   |
| `MCP_AUTH_MODE`                           | Authentication strategy: `jwt` or `oauth`.                               | No                   | (none)                   |
| **`MCP_AUTH_SECRET_KEY`**                 | 32+ char secret for JWT. **Required for `jwt` mode.**                    | **Yes (if `jwt`)**   | `undefined`              |
| `OAUTH_ISSUER_URL`                        | URL of the OAuth 2.1 issuer.                                             | **Yes (if `oauth`)** | `undefined`              |
| `OAUTH_AUDIENCE`                          | Audience claim for OAuth tokens.                                         | **Yes (if `oauth`)** | `undefined`              |
| `OAUTH_JWKS_URI`                          | URI for the JSON Web Key Set (optional, derived from issuer if omitted). | No                   | (derived)                |
| `MCP_LOG_LEVEL`                           | Logging level (`debug`, `info`, `error`, etc.).                          | No                   | `info`                   |
| `OBSIDIAN_SHEET_PLUS_VERIFY_SSL`          | Set to `false` to disable SSL verification.                              | No                   | `true`                   |

### Connecting to the Obsidian Sheet Plus API

To connect the MCP server to your Obsidian Sheet Plus plugin, you need to configure the base URL (`OBSIDIAN_SHEET_PLUS_BASE_URL`) and API key (`OBSIDIAN_SHEET_PLUS_API_KEY`). The Obsidian Sheet Plus plugin offers two ways to connect:

1.  **Encrypted (HTTPS) - Default**:

    - The plugin provides a secure `https://` endpoint (e.g., `https://127.0.0.1:27124`).
    - This uses a self-signed certificate, which will cause connection errors by default.
    - **To fix this**, you must set the `OBSIDIAN_SHEET_PLUS_VERIFY_SSL` environment variable to `"false"`. This tells the server to trust the self-signed certificate.

2.  **Non-encrypted (HTTP) - Recommended for Simplicity**:
    - In the plugin's settings within Obsidian, you can enable the "Non-encrypted (HTTP) Server".
    - This provides a simpler `http://` endpoint (e.g., `http://127.0.0.1:27123`).
    - When using this URL, you do not need to worry about SSL verification.

**Example `env` configuration for your MCP client:**

_Using the non-encrypted HTTP URL (recommended):_

```json
"env": {
  "OBSIDIAN_SHEET_PLUS_API_KEY": "YOUR_API_KEY_FROM_OBSIDIAN_SHEET_PLUS_PLUGIN",
  "OBSIDIAN_SHEET_PLUS_BASE_URL": "http://127.0.0.1:27123"
}
```

_Using the encrypted HTTPS URL:_

```json
"env": {
  "OBSIDIAN_SHEET_PLUS_API_KEY": "YOUR_API_KEY_FROM_OBSIDIAN_SHEET_PLUS_PLUGIN",
  "OBSIDIAN_SHEET_PLUS_BASE_URL": "https://127.0.0.1:27124",
  "OBSIDIAN_SHEET_PLUS_VERIFY_SSL": "false"
}
```

## Project Structure

The codebase follows a modular structure within the `src/` directory:

```
src/
├── index.ts           # Entry point: Initializes and starts the server
├── config/            # Configuration loading (env vars, package info)
│   └── index.ts
├── mcp-server/        # Core MCP server logic and capability registration
│   ├── server.ts      # Server setup, transport handling, tool/resource registration
│   ├── resources/     # MCP Resource implementations (currently none)
│   ├── tools/         # MCP Tool implementations (subdirs per tool)
│   └── transports/    # Stdio and HTTP transport logic
│       └── auth/      # Authentication strategies (JWT, OAuth)
├── services/          # Abstractions for external APIs
│   └── obsidianSheetPlusRestAPI/ # Typed client for Obsidian Sheet Plus API
├── types-global/      # Shared TypeScript type definitions (errors, etc.)
└── utils/             # Common utility functions (logger, error handler, security, etc.)
```

For a detailed file tree, run `npm run tree` or see [docs/tree.md](docs/tree.md).

## Tools

The Obsidian Sheet Plus MCP Server provides a suite of tools for interacting with your Obsidian Sheet Plus data, callable via the Model Context Protocol.

| Tool Name                           | Description                                         | Key Arguments                                   |
| :---------------------------------- | :-------------------------------------------------- | :---------------------------------------------- |
| `obsidian_sheet_plus_get_sheet_list` | Retrieves the list of sheets in the workbook.       | N/A                                             |
| `obsidian_sheet_plus_get_sheet_data` | Gets data from a specific sheet.                    | `sheetName`                                     |
| `obsidian_sheet_plus_get_workbook`   | Gets full workbook data including all sheets.       | N/A                                             |
| `obsidian_sheet_plus_set_sheet_data` | Sets data to a specific sheet.                      | `sheetName`, `data`                             |

_Note: All tools support comprehensive error handling and return structured JSON responses._

## Resources

**MCP Resources are not implemented in this version.**

This server currently focuses on providing interactive tools for vault manipulation. Future development may introduce resource capabilities (e.g., exposing notes or search results as readable resources).

## Development

### Build and Test

To get started with development, clone the repository, install dependencies, and use the following scripts:

```bash
# Install dependencies
npm install

# Build the project (compile TS to JS in dist/ and make executable)
npm run rebuild

# Start the server locally using stdio transport
npm start:stdio

# Start the server using http transport
npm run start:http

# Format code using Prettier
npm run format

# Inspect the server's capabilities using the MCP Inspector tool
npm run inspect:stdio
# or for the http transport:
npm run inspect:http
```

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with the <a href="https://modelcontextprotocol.io/">Model Context Protocol</a>
</div>
