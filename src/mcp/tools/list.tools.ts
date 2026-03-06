import z from "zod"
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js"
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js"
import type { IVaultService } from "../../interfaces/vault-service.interface"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"

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
        description: "get all .md and folders of vault obsidian",
        inputSchema: { dirname: z.string().optional() },
      },
      this.cb.bind(this),
    )
  }
}
