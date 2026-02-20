import type { VaultService } from "../../services/vault.service"
import { CreateDto } from "../dto/create.dto"

export class CreateCommand {
  constructor(private service: VaultService) {}

  async execute(args: string[]) {
    const title = args.find((it) => it.startsWith("--title="))?.split("=")[1]

    const content = args
      .find((it) => it.startsWith("--content="))
      ?.split("=")[1]

    if (!title || !content) {
      console.log("necessary insert --title and --content")
      return
    }

    const dto = new CreateDto(title, content)

    await this.service.create(dto.fromEntity())
  }
}
