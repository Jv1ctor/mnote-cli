import z from "zod"
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js"
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"
import type { IVaultService } from "../../../interfaces/vault-service.interface"

export class ListTool implements ITools {
  constructor(
    private readonly service: IVaultService,
    private path: string,
  ) {}

  private async cb(
    { dirname }: { dirname?: string },
    _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): Promise<CallToolResult> {
    const list = await this.service.list(this.path, dirname)

    return {
      content: [
        {
          type: "text",
          text: list.join(","),
        },
      ],
    }
  }

  execute() {
    server.registerTool(
      "list_all_content",
      {
        description:
          "Lists all .md files and folders inside the configured Obsidian vault. Optionally scope to a subdirectory via dirname. Returns a comma-separated list of paths. Call this first when you need to discover which notes or folders exist before reading or editing.",
        inputSchema: { dirname: z.string().optional() },
      },
      this.cb.bind(this),
    )
  }
}
