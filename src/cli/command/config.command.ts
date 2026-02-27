import type { Config } from "../../config/config"
import type { ICommand } from "../interface/command.interface"

export class ConfigCommand implements ICommand {
  constructor(private config: Config) {}

  async execute(args: string[]) {
    const path = args
      .find((it) => it.startsWith("--vault-path="))
      ?.split("=")[1]
    if (!path) {
      console.log("necessary insert --vault-path")
      return
    }

    await this.config.savePath(path)
  }
}
