#!/usr/bin/env bun

import { CreateCommand } from "./command/create.command"
import { ReadCommand } from "./command/read.command"
import { getPathArg } from "./utils/path-arg.utils"
import { ListCommand } from "./command/list.command"
import type { Config } from "../config/config"
import type { IVaultService } from "../interfaces/vault-service.interface"
import { ConfigCommand } from "./command/config.command"

export async function cli(service: IVaultService, config: Config) {
  const args = process.argv.slice(2)
  const command = args[0]

  if (!command || command.includes("help")) {
    console.error("Use: mnote config --vault-path=<path>")
    console.error("Use: mnote create --title=<title> --content=<content>")
    console.error("Use: mnote read --name=<name>")
    console.error("Use: mnote list optional(--dir=<dirname>)")
  }

  if (command == "config") {
    const configCommand = new ConfigCommand(config)

    await configCommand.execute(args)
  }

  if (command === "create") {
    const path = (await config.getPath()) || getPathArg(args)
    if (!path) return

    const create = new CreateCommand(service, path)

    await create.execute(args)
  }

  if (command == "read") {
    const path = (await config.getPath()) || getPathArg(args)
    if (!path) return

    const read = new ReadCommand(service, path)

    await read.execute(args)
  }

  if (command == "list") {
    const path = (await config.getPath()) || getPathArg(args)
    if (!path) return

    const list = new ListCommand(service, path)

    await list.execute(args)
  }
}
