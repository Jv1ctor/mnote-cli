import type { IVaultService } from "../interfaces/vault-service.interface"
import type { Config } from "../config/config"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { tools } from "./tools"
import { server } from "./server"

export async function mcp(service: IVaultService, config: Config) {
  await tools(service, config)

  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error("mnote wrapper for Obsidian Vault MCP Server running on stdio")
}
