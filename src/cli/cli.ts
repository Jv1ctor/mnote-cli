#!/usr/bin/env bun

import { resolvePath } from "../helpers/resolve-path.helpers"
import { VaultRepository } from "../repositories/vault.repository"
import { VaultService } from "../services/vault.service"
import { CreateCommand } from "./command/create.command"
import { ReadCommand } from "./command/read.command"
import { getPathArg } from "./utils/path-arg.utils"
import { ListCommand } from "./command/list.command"
import type { Config } from "../config/config"

export async function cli(config: Config) {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command == "config") {
    const path = args
      .find((it) => it.startsWith("--vault-path="))
      ?.split("=")[1]
    if (!path) {
      console.log("necessary insert --vault-path")
      return
    }

    await config.savePath(path)
  }

  if (!command || command.includes("help")) {
    console.log("Use: mnote config --vault-path=<path>")
    console.log("Use: mnote create --title=<title> --content=<content>")
    console.log("Use: mnote read --name=<name>")
    console.log("Use: mnote list optional(--dir=<dirname>)")
  }

  if (command === "create") {
    const path = (await config.getPath()) || getPathArg(args)
    if (!path) return

    const repo = new VaultRepository(resolvePath(path))
    const service = new VaultService(repo)
    const create = new CreateCommand(service)

    create.execute(args)
  }

  if (command == "read") {
    const path = (await config.getPath()) || getPathArg(args)
    if (!path) return

    const repo = new VaultRepository(resolvePath(path))
    const service = new VaultService(repo)
    const read = new ReadCommand(service)

    await read.execute(args)
  }

  if (command == "list") {
    const path = (await config.getPath()) || getPathArg(args)
    if (!path) return

    const repo = new VaultRepository(resolvePath(path))
    const service = new VaultService(repo)
    const list = new ListCommand(service)

    await list.execute(args)
  }
}
