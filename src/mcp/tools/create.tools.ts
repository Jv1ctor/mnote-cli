import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types.js"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"
import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol.js"
import type { IVaultService } from "../../interfaces/vault-service.interface"
import type { Note } from "../../entity/note.entity"
import { CreateDto } from "../dtos/create.dto"
import type { IMapper } from "../../interfaces/mapper.interface"

export class CreateTool implements ITools {
  constructor(
    private readonly service: IVaultService,
    private readonly mapper: IMapper<Note, CreateDto>,
    private path: string,
  ) {}

  private async cb(
    { note }: { note: CreateDto },
    _extra: RequestHandlerExtra<ServerRequest, ServerNotification>,
  ): Promise<CallToolResult> {
    const entity = this.mapper.toEntity(note)
    await this.service.create(this.path, entity)

    return {
      content: [
        {
          type: "text",
          text: "created content",
        },
      ],
    }
  }

  execute() {
    server.registerTool(
      "create-note",
      {
        description: "insert content markdown in file",
        inputSchema: { note: CreateDto },
      },
      this.cb.bind(this),
    )
  }
}
