import { spawn } from "bun"
import type { IVaultService } from "../../interfaces/vault-service.interface"
import type { ICommand } from "../interface/command.interface"

export class ReadCommand implements ICommand {
  constructor(
    private service: IVaultService,
    private path: string,
  ) {}

  async execute(args: string[]) {
    const name = args.find((it) => it.startsWith("--name="))?.split("=")[1]

    if (!name) {
      console.log("necessary insert --name")
      return
    }

    const content = await this.service.read(this.path, name)

    if (content.length <= 0) {
      console.log("empty note")
      return
    }

    if (!process.stdout.isTTY) {
      console.log(content)
      return
    }

    const pager = spawn(["less"], {
      stdio: ["pipe", "inherit", "inherit"],
    })

    pager.stdin.write(content)
    pager.stdin.end()
  }
}
