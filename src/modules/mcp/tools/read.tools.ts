import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"
import z from "zod"
import type { IVaultService } from "../../../interfaces/vault-service.interface"

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
        description:
          "Returns the full markdown content of a single note identified by its filename (without .md extension). Use list_all_content first to discover valid note names. Input: name — the note filename.",
        inputSchema: { name: z.string() },
      },
      this.cb.bind(this),
    )
  }
}
