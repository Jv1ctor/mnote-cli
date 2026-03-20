import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import type { ITools } from "../interface/tools.interface"
import { server } from "../server"
import { UpdateDto } from "../dtos/update.dto"
import type { OptionsDto } from "../dtos/options.dto"
import type { IVaultService } from "../../../interfaces/vault-service.interface"
import type { Note } from "../../../entity/note.entity"
import type { IMapper } from "../../../interfaces/mapper.interface"

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
        description:
          "Overwrites specific lines in an existing note. Input: note.title (filename without .md), note.contents — array of {line, body} pairs indicating which line numbers to replace, and options.lineStart / options.lineEnd to restrict the replacement range. Use read_content first to know current line numbers.",
        inputSchema: UpdateDto,
      },
      this.cb.bind(this),
    )
  }
}
