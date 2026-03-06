import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import type { IVaultService } from "../../interfaces/vault-service.interface"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"
import z from "zod"

export class ReadTool implements ITools {
  constructor(
    private readonly service: IVaultService,
    private path: string,
  ) {}

  private async cb({ name }: { name: string }): Promise<CallToolResult> {
    const file = await this.service.read(this.path, name)

    return {
      content: [
        {
          type: "text",
          text: file,
        },
      ],
    }
  }

  execute(): void {
    server.registerTool(
      "read_content",
      {
        description: "read all content of .md specific by name",
        inputSchema: { name: z.string() },
      },
      this.cb.bind(this),
    )
  }
}
