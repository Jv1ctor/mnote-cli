#!/usr/bin/env bun

import { cli } from "./cli/cli"
import { Config } from "./config/config"
import { VaultRepositoryFactory } from "./repositories/vault.repository.factory"
import { VaultService } from "./services/vault.service"

const run = async () => {
  const config = new Config()
  await config.execute()

  const repositoryFactory = new VaultRepositoryFactory()
  const service = new VaultService(repositoryFactory)
  cli(service, config)
}

run()
