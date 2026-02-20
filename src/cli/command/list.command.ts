import type { VaultService } from "../../services/vault.service"

export class ListCommand {
  constructor(private service: VaultService) {}

  async execute(args: string[]) {
    const dir = args.find((it) => it.startsWith("--dir="))?.split("=")[1]

    const result = await this.service.list(dir)
    console.log(result.join("\n"))
  }
}
