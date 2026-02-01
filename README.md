# Obsidian Sheet Plus MCP Server

[![TypeScript](https://img.shields.io/badge/TypeScript-^5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP%20SDK-^1.13.0-green.svg)](https://modelcontextprotocol.io/)
[![Version](https://img.shields.io/badge/Version-2.0.7-blue.svg)](./CHANGELOG.md)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Status](https://img.shields.io/badge/Status-Production-brightgreen.svg)](https://github.com/ljcoder2015/obsidian-sheet-plus-mcp-server/issues)
[![GitHub](https://img.shields.io/github/stars/ljcoder2015/obsidian-sheet-plus-mcp-server?style=social)](https://github.com/ljcoder2015/obsidian-sheet-plus-mcp-server)

**Empower your AI agents and development tools with seamless Obsidian Sheet Plus integration!**

An MCP (Model Context Protocol) server providing comprehensive access to your Obsidian Sheet Plus data. Enables LLMs and AI agents to read, write, and manage your sheets through the Obsidian Sheet Plus plugin API.

Built on a robust TypeScript foundation, this server follows a modular architecture with comprehensive error handling, logging, and security features.

## 🚀 Core Capabilities: Obsidian Sheet Plus Tools 🛠️

This server equips your AI with 13 specialized tools to interact with your Obsidian Sheet Plus data:

| Tool Name | Description | Key Features |
| :-------- | :---------- | :----------- |
| `get_sheet_list` | Retrieves the list of sheets in the workbook | Returns sheet names, IDs, and metadata |
| `get_sheet_data` | Gets data from a specific sheet | Supports range selection and structured data formats |
| `get_workbook_data` | Gets full workbook data including all sheets | Returns comprehensive workbook information |
| `set_sheet_data` | Sets data to a specific sheet | Supports batch operations and 2D array data |
| `create_sheet` | Creates a new sheet in the workbook | Supports custom sheet names |
| `set_formula` | Sets formulas in specified cells | Supports Excel-compatible formulas |
| `set_range_style` | Sets style for specified cell range | Supports font, color, background, borders, etc. |
| `set_data_validation` | Sets data validation rules for cells | Supports various validation types and rules |
| `clear_contents` | Clears contents of specified cell range | Removes cell values while preserving formatting |
| `clear_format` | Clears formats of specified cell range | Resets cell formatting to defaults |
| `clear_all` | Clears both contents and formats | Completely resets specified cells |
| `clear_data_validation` | Clears data validation rules | Removes validation constraints from cells |
| `check_status` | Checks the status of the MCP server | Verifies connection to Obsidian Sheet Plus plugin |

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Development](#development)
- [License](#license)

## Overview

The Obsidian Sheet Plus MCP Server acts as a bridge, allowing applications (MCP Clients) that understand the Model Context Protocol (MCP) – like advanced AI assistants (LLMs), IDE extensions, or custom scripts – to interact directly and safely with your Obsidian Sheet Plus data.

Instead of complex scripting or manual interaction, your tools can leverage this server to:

- **Automate sheet management**: Read sheet data, update content, and manage your Obsidian Sheet Plus workbooks programmatically.
- **Integrate Obsidian Sheet Plus into AI workflows**: Enable LLMs to access and modify your spreadsheet data as part of their research, analysis, or reporting tasks.
- **Build custom Obsidian Sheet Plus tools**: Create external applications that interact with your sheet data in novel ways.

This server provides a standardized, secure, and efficient way to expose Obsidian Sheet Plus functionality via the MCP standard. It achieves this by communicating with the Obsidian Sheet Plus plugin API running inside your Obsidian vault.

## Features

### Core Utilities

- **Logging**: Structured, configurable logging with sensitive data redaction
- **Error Handling**: Centralized error processing with standardized error types
- **Configuration**: Environment variable loading with comprehensive validation
- **Input Validation**: Uses `zod` for robust schema validation
- **Request Context**: Tracking and correlation of operations via unique request IDs
- **Type Safety**: Strong typing enforced by TypeScript and Zod schemas
- **Flexible Transport**: Supports both stdio and HTTP transports

### Obsidian Sheet Plus Integration

- **Direct API Integration**: Communicates directly with the Obsidian Sheet Plus plugin
- **Comprehensive Toolset**: 13 specialized tools for sheet manipulation
- **Safety Features**: Robust error handling and input validation
- **Efficient Operations**: Supports batch operations for better performance

## Installation

### Prerequisites

1. **Obsidian**: You need Obsidian installed
2. **Obsidian Sheet Plus Plugin**: Install and enable the Obsidian Sheet Plus plugin within your Obsidian vault
3. **API Key**: Configure an API key within the Obsidian Sheet Plus plugin settings
4. **Node.js & npm**: Ensure you have Node.js (v18+ recommended) and npm installed

### Installation Methods

#### Method 1: Using npx (Recommended for AI Agents)

The easiest way to use this server with AI agents like Claude is through `npx`, which automatically downloads and runs the package:

```bash
npx obsidian-sheet-plus-mcp-server
```

#### Method 2: Global Installation

For frequent use, you can install the server globally:

```bash
npm install -g obsidian-sheet-plus-mcp-server

# Then run it anytime
obsidian-sheet-plus-mcp-server
```

#### Method 3: From Source

For development or customization:

```bash
# Clone the repository
git clone https://github.com/ljcoder2015/obsidian-sheet-plus-mcp-server.git
cd obsidian-sheet-plus-mcp-server

# Install dependencies
npm install

# Build the project
npm run rebuild

# Run the server
npm start
```

## Configuration

### MCP Client Settings

Add the following to your MCP client's configuration file (e.g., `claude_desktop_config.json` or `cline_mcp_settings.json`):

```json
{
  "mcpServers": {
    "obsidian-sheet-plus-mcp-server": {
      "command": "npx",
      "args": ["obsidian-sheet-plus-mcp-server"],
      "env": {
        "OBSIDIAN_SHEET_PLUS_API_KEY": "YOUR_API_KEY_FROM_OBSIDIAN_SHEET_PLUS_PLUGIN",
        "OBSIDIAN_SHEET_PLUS_BASE_URL": "http://127.0.0.1:3000",
        "OBSIDIAN_SHEET_PLUS_VERIFY_SSL": "false"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### Environment Variables

| Variable | Description | Required | Default |
| :------- | :---------- | :------- | :------- |
| `OBSIDIAN_SHEET_PLUS_API_KEY` | API Key from Obsidian Sheet Plus plugin | ✅ Yes | `undefined` |
| `OBSIDIAN_SHEET_PLUS_BASE_URL` | Base URL of Obsidian Sheet Plus API | ✅ Yes | `http://127.0.0.1:3000` |
| `MCP_TRANSPORT_TYPE` | Server transport: `stdio` or `http` | No | `stdio` |
| `MCP_HTTP_PORT` | Port for HTTP server | No | `3010` |
| `MCP_LOG_LEVEL` | Logging level (`debug`, `info`, `error`) | No | `info` |
| `OBSIDIAN_SHEET_PLUS_VERIFY_SSL` | Set to `false` to disable SSL verification | No | `true` |

### Connecting to Obsidian Sheet Plus API

- **Non-encrypted (HTTP) - Recommended**: 
   - Enable "Non-encrypted (HTTP) Server" in plugin settings
   - Use URL: `http://127.0.0.1:3000`

## Usage

### Example: Using with Claude

Once configured, Claude can use the MCP server to interact with your Obsidian sheets:

```
Human: Get data from the "Budget" sheet in my Obsidian workbook
Assistant: I'll help you get data from the "Budget" sheet. Let me use the Obsidian Sheet Plus tool to retrieve this information.

[Using tool: get_sheet_data]
[Parameters: {"sheetName": "Budget"}]

[Tool response: {
  "success": true,
  "data": [
    ["Category", "Amount"],
    ["Housing", 1500],
    ["Food", 400],
    ["Transportation", 300],
    ["Entertainment", 200]
  ],
  "message": "Sheet data retrieved successfully"
}]

Here's the data from your "Budget" sheet:

| Category | Amount |
| :------- | :----- |
| Housing | 1500 |
| Food | 400 |
| Transportation | 300 |
| Entertainment | 200 |
```

### Example: Updating Sheet Data

```
Human: Update the "Budget" sheet to change Food to 450
Assistant: I'll help you update the "Budget" sheet. Let me use the Obsidian Sheet Plus tool to make this change.

[Using tool: set_sheet_data]
[Parameters: {
  "sheetName": "Budget",
  "range": "B3",
  "values": [[450]]
}]

[Tool response: {
  "success": true,
  "message": "Sheet data updated successfully"
}]

I've successfully updated the "Food" amount in your "Budget" sheet to 450.
```

## Project Structure

The codebase follows a modular structure:

```
src/
├── index.ts           # Entry point: Initializes and starts the server
├── config/            # Configuration loading (env vars, package info)
├── mcp-server/        # Core MCP server logic
│   ├── server.ts      # Server setup and transport handling
│   ├── tools/         # MCP Tool implementations (13 tools)
│   └── transports/    # Stdio and HTTP transport logic
├── services/          # External API abstractions
│   └── obsidianSheetPlusRestAPI/ # Obsidian Sheet Plus API client
├── types-global/      # Shared TypeScript type definitions
└── utils/             # Common utility functions (logger, error handler, etc.)
```

## Development

### Build and Test

```bash
# Install dependencies
npm install

# Build the project (compile TypeScript)
npm run rebuild

# Start the server with stdio transport
npm run start:stdio

# Start the server with HTTP transport
npm run start:http

# Format code
npm run format

# Inspect server capabilities
npm run inspect:stdio
```

### Adding New Tools

1. Create a new directory under `src/mcp-server/tools/`
2. Implement the tool logic, registration, and handler
3. Register the tool in `src/mcp-server/server.ts`

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
Built with the <a href="https://modelcontextprotocol.io/">Model Context Protocol</a>
</div>