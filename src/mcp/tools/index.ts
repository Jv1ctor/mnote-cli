import type { Config } from "../../config/config"
import type { IVaultService } from "../../interfaces/vault-service.interface"
import { CreateMapper } from "../mappers/create.mapper"
import { UpdateMapper } from "../mappers/update.mapper"
import { CreateTool } from "./create.tools"
import { ListTool } from "./list.tools"
import { ReadTool } from "./read.tools"
import { UpdateTool } from "./update.tools"

export async function tools(service: IVaultService, config: Config) {
  const path = await config.getPath()
  if (!path) {
    console.error("not found path, please set you vault path")
    return
  }

  new ListTool(service, path).execute()
  new ReadTool(service, path).execute()
  const createMapper = new CreateMapper()
  new CreateTool(service, createMapper, path).execute()

  const updateMapper = new UpdateMapper()
  new UpdateTool(service, updateMapper, path).execute()
}
