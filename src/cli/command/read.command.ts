import { spawn } from "bun"
import type { VaultService } from "../../services/vault.service"

export class ReadCommand {
  constructor(private service: VaultService) {}

  async execute(args: string[]) {
    const name = args.find((it) => it.startsWith("--name="))?.split("=")[1]

    if (!name) {
      console.log("necessary insert --name")
      return
    }

    const content = await this.service.read(name)
    const pager = spawn(["less"], {
      stdio: ["pipe", "inherit", "inherit"],
    })
    pager.stdin.write(content)
  }
}
