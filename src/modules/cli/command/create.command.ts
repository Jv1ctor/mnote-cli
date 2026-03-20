import type { IVaultService } from "../../../interfaces/vault-service.interface"
import { CreateDto } from "../dtos/create.dto"
import type { ICommand } from "../interface/command.interface"

export class CreateCommand implements ICommand {
  constructor(
    private service: IVaultService,
    private path: string,
  ) {}

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

    await this.service.create(this.path, dto.toEntity())
  }
}
