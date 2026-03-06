import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import type { IVaultService } from "../../interfaces/vault-service.interface"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"
import { UpdateDto } from "../dtos/update.dto"
import type { IMapper } from "../../interfaces/mapper.interface"
import type { Note } from "../../entity/note.entity"
import type { OptionsDto } from "../dtos/options.dto"

export class UpdateTool implements ITools {
  constructor(
    private readonly service: IVaultService,
    private readonly mapper: IMapper<Note, UpdateDto, OptionsDto>,
    private path: string,
  ) {}

  private async cb(dto: UpdateDto): Promise<CallToolResult> {
    const entity = this.mapper.toEntity(dto)
    await this.service.update(this.path, entity, dto.options)

    return {
      content: [
        {
          type: "text",
          text: "updated sucess",
        },
      ],
    }
  }

  execute(): void {
    server.registerTool(
      "update_content",
      {
        description: "update content specific lines and file",
        inputSchema: UpdateDto,
      },
      this.cb.bind(this),
    )
  }
}
