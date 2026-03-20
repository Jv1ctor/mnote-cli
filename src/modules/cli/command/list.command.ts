import type { IVaultService } from "../../../interfaces/vault-service.interface"
import type { ICommand } from "../interface/command.interface"

export class ListCommand implements ICommand {
  constructor(
    private service: IVaultService,
    private path: string,
  ) {}

  async execute(args: string[]) {
    const dir = args.find((it) => it.startsWith("--dir="))?.split("=")[1]

    const result = await this.service.list(this.path, dir)
    console.log(result.join("\n"))
  }
}
